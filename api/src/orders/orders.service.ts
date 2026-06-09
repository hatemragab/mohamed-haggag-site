import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CategoriesService } from '../categories/categories.service';
import { PlansService } from '../plans/plans.service';
import { UsersService } from '../users/users.service';
import { CreateOrderDto } from './dto/order.dto';
import { Order, OrderDocument, PaymentProviderKey } from './order.schema';
import {
  PaymentProvider,
  PaymobProvider,
  StripeProvider,
} from './payments/payment-provider';

@Injectable()
export class OrdersService {
  private readonly providers: Record<PaymentProviderKey, PaymentProvider>;

  constructor(
    @InjectModel(Order.name) private readonly orders: Model<OrderDocument>,
    private readonly plans: PlansService,
    private readonly categories: CategoriesService,
    private readonly users: UsersService,
    paymob: PaymobProvider,
    stripe: StripeProvider,
  ) {
    this.providers = { paymob: paymob, stripe: stripe };
  }

  private view(o: OrderDocument) {
    return {
      id: o._id.toString(),
      planKey: o.planKey,
      planName: o.planName,
      categoryId: o.category?.toString() ?? null,
      amount: o.amount,
      currency: o.currency,
      status: o.status,
      provider: o.provider,
      createdAt: o.createdAt,
      paidAt: o.paidAt,
    };
  }

  async create(userId: string, dto: CreateOrderDto) {
    const plan = await this.plans.byKey(dto.planKey);
    let categoryId: string | null = null;
    if (dto.planKey === 'single') {
      if (!dto.categoryId)
        throw new BadRequestException('اختر المسار المراد شراؤه');
      const cat = await this.categories.findById(dto.categoryId);
      categoryId = cat._id.toString();
    }
    const provider = this.providers[dto.provider ?? 'paymob'];
    const order = await this.orders.create({
      user: new Types.ObjectId(userId),
      planKey: plan.key,
      planName: plan.name,
      category: categoryId ? new Types.ObjectId(categoryId) : null,
      amount: plan.prices[dto.currency],
      currency: dto.currency,
      status: 'pending',
      provider: provider.key,
    });
    const { reference } = await provider.createPayment({
      orderId: order._id.toString(),
      amount: order.amount,
      currency: order.currency,
    });
    order.providerRef = reference;
    await order.save();
    return this.view(order);
  }

  /** Mock capture: confirm with the provider, mark paid, apply the unlock. */
  async pay(userId: string, orderId: string) {
    const order = await this.orders.findById(orderId).exec();
    if (!order) throw new NotFoundException('الطلب غير موجود');
    if (order.user.toString() !== userId)
      throw new ForbiddenException('هذا الطلب لا يخصّك');
    if (order.status === 'paid') return this.view(order);
    if (order.status !== 'pending')
      throw new BadRequestException('لا يمكن دفع هذا الطلب');

    const { success } = await this.providers[order.provider].confirmPayment(
      order.providerRef,
    );
    if (!success) {
      order.status = 'failed';
      await order.save();
      throw new BadRequestException('فشلت عملية الدفع — حاول مجدداً');
    }
    order.status = 'paid';
    order.paidAt = new Date();
    await order.save();
    await this.users.applyUnlock(
      userId,
      order.planKey,
      order.category?.toString() ?? null,
    );
    return this.view(order);
  }

  async mine(userId: string) {
    const list = await this.orders
      .find({ user: userId })
      .sort({ createdAt: -1 })
      .exec();
    return list.map((o) => this.view(o));
  }

  /** Admin listing with student identity. */
  async adminList() {
    const list = await this.orders
      .find()
      .sort({ createdAt: -1 })
      .populate<{
        user: { name: string; email: string } | null;
      }>('user', 'name email')
      .exec();
    return list.map((o) => ({
      ...this.view(o as unknown as OrderDocument),
      student: o.user?.name ?? '—',
      email: o.user?.email ?? '',
    }));
  }

  async adminRemove(id: string) {
    const res = await this.orders.deleteOne({ _id: id }).exec();
    if (res.deletedCount === 0) throw new NotFoundException('الطلب غير موجود');
    return { ok: true };
  }

  /** Latest paid order per user — used for the admin students "plan" column. */
  async latestPaidByUsers(userIds: Types.ObjectId[]) {
    const rows = await this.orders
      .aggregate<{
        _id: Types.ObjectId;
        planName: string;
      }>([
        { $match: { user: { $in: userIds }, status: 'paid' } },
        { $sort: { createdAt: -1 } },
        { $group: { _id: '$user', planName: { $first: '$planName' } } },
      ])
      .exec();
    return new Map(rows.map((r) => [r._id.toString(), r.planName]));
  }

  async overviewStats() {
    const all = await this.orders
      .find()
      .sort({ createdAt: -1 })
      .populate<{ user: { name: string } | null }>('user', 'name')
      .exec();
    const revenue: Record<string, number> = {};
    for (const o of all)
      if (o.status === 'paid')
        revenue[o.currency] = (revenue[o.currency] ?? 0) + o.amount;
    return {
      paymentsCount: all.length,
      revenue,
      latest: all.slice(0, 4).map((o) => ({
        id: o._id.toString(),
        student: o.user?.name ?? '—',
        plan: o.planName,
        amount: o.amount,
        currency: o.currency,
        status: o.status,
        date: o.createdAt,
      })),
    };
  }
}

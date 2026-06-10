import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from '../categories/category.schema';
import { MK } from '../i18n/messages';
import { LessonsService } from '../lessons/lessons.service';
import { OrdersService } from '../orders/orders.service';
import { SiteContentService } from '../site-content/site-content.service';
import { User, UserDocument } from '../users/user.schema';
import { CreateStudentDto } from './dto/admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private readonly users: Model<UserDocument>,
    @InjectModel(Category.name)
    private readonly categories: Model<CategoryDocument>,
    private readonly lessons: LessonsService,
    private readonly orders: OrdersService,
    private readonly siteContent: SiteContentService,
  ) {}

  async overview() {
    const [students, categories, lessons, orderStats, content] =
      await Promise.all([
        this.users.countDocuments({ role: 'student' }).exec(),
        this.categories.countDocuments().exec(),
        this.lessons.countAll(),
        this.orders.overviewStats(),
        this.siteContent.get(),
      ]);
    return {
      kpis: {
        students,
        categories,
        lessons,
        payments: orderStats.paymentsCount,
      },
      revenue: orderStats.revenue,
      latestPayments: orderStats.latest,
      displayedStats: content.instructor.stats,
    };
  }

  async students(q?: string) {
    const filter: Record<string, unknown> = { role: 'student' };
    if (q?.trim()) {
      const rx = new RegExp(
        q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        'i',
      );
      filter.$or = [{ name: rx }, { email: rx }];
    }
    const list = await this.users.find(filter).sort({ createdAt: -1 }).exec();
    const planMap = await this.orders.latestPaidByUsers(list.map((u) => u._id));
    return list.map((u) => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      phone: u.phone ?? null,
      plan:
        planMap.get(u._id.toString()) ?? (u.unlockedAll ? 'وصول كامل' : '—'),
      joined: u.createdAt,
      status: u.status,
    }));
  }

  async createStudent(dto: CreateStudentDto) {
    const existing = await this.users
      .findOne({ email: dto.email.toLowerCase() })
      .exec();
    if (existing) throw new ConflictException(MK.emailTaken);
    await this.users.create({
      name: dto.name.trim(),
      email: dto.email.toLowerCase(),
      phone: dto.phone?.trim() || undefined,
      passwordHash: await bcrypt.hash(dto.password, 10),
      role: 'student',
      unlockedAll: dto.grantAll ?? false,
    });
    return this.students();
  }

  async toggleStatus(id: string) {
    const user = await this.users.findById(id).exec();
    if (!user) throw new NotFoundException(MK.studentNotFound);
    if (user.role !== 'student')
      throw new BadRequestException(MK.cannotModifyAccount);
    user.status = user.status === 'active' ? 'suspended' : 'active';
    await user.save();
    return { id, status: user.status };
  }

  async removeStudent(id: string) {
    const user = await this.users.findById(id).exec();
    if (!user) throw new NotFoundException(MK.studentNotFound);
    if (user.role !== 'student')
      throw new BadRequestException(MK.cannotDeleteAccount);
    await user.deleteOne();
    return { ok: true };
  }
}

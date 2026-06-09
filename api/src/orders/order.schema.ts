import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {
  CURRENCY_CODES,
  CurrencyCode,
  PLAN_KEYS,
  PlanKey,
} from '../plans/plan.schema';

export const ORDER_STATUSES = [
  'pending',
  'paid',
  'failed',
  'refunded',
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_PROVIDERS = ['paymob', 'stripe'] as const;
export type PaymentProviderKey = (typeof PAYMENT_PROVIDERS)[number];

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  user: Types.ObjectId;

  @Prop({ required: true, enum: PLAN_KEYS })
  planKey: PlanKey;

  /** Plan name snapshot at purchase time (plans are admin-editable). */
  @Prop({ required: true })
  planName: string;

  /** Set for `single` purchases only. */
  @Prop({ type: Types.ObjectId, ref: 'Category', default: null })
  category: Types.ObjectId | null;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: CURRENCY_CODES })
  currency: CurrencyCode;

  @Prop({ type: String, enum: ORDER_STATUSES, default: 'pending' })
  status: OrderStatus;

  @Prop({ required: true, enum: PAYMENT_PROVIDERS })
  provider: PaymentProviderKey;

  @Prop({ default: '' })
  providerRef: string;

  @Prop({ type: Date, default: null })
  paidAt: Date | null;
}

export type OrderDocument = HydratedDocument<Order> & {
  createdAt: Date;
  updatedAt: Date;
};
export const OrderSchema = SchemaFactory.createForClass(Order);

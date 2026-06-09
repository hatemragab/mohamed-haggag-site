import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export const PLAN_KEYS = ['single', 'monthly', 'bundle'] as const;
export type PlanKey = (typeof PLAN_KEYS)[number];

export const CURRENCY_CODES = ['AED', 'EGP', 'USD'] as const;
export type CurrencyCode = (typeof CURRENCY_CODES)[number];

@Schema({ _id: false })
export class PlanPrices {
  @Prop({ required: true })
  AED: number;

  @Prop({ required: true })
  EGP: number;

  @Prop({ required: true })
  USD: number;
}
export const PlanPricesSchema = SchemaFactory.createForClass(PlanPrices);

@Schema({ timestamps: true })
export class Plan {
  @Prop({ required: true, unique: true, enum: PLAN_KEYS })
  key: PlanKey;

  @Prop({ required: true })
  name: string;

  @Prop({ default: '' })
  tagline: string;

  @Prop({ type: PlanPricesSchema, required: true })
  prices: PlanPrices;

  @Prop({ default: '' })
  period: string;

  @Prop({ type: [String], default: [] })
  features: string[];

  @Prop({ default: '' })
  cta: string;

  @Prop({ default: false })
  highlight: boolean;

  @Prop({ default: 0 })
  order: number;
}

export type PlanDocument = HydratedDocument<Plan>;
export const PlanSchema = SchemaFactory.createForClass(Plan);

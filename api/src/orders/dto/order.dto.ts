import { IsIn, IsMongoId, IsOptional } from 'class-validator';
import {
  CURRENCY_CODES,
  CurrencyCode,
  PLAN_KEYS,
  PlanKey,
} from '../../plans/plan.schema';
import { PAYMENT_PROVIDERS, PaymentProviderKey } from '../order.schema';

export class CreateOrderDto {
  @IsIn(PLAN_KEYS)
  planKey: PlanKey;

  @IsOptional()
  @IsMongoId()
  categoryId?: string;

  @IsIn(CURRENCY_CODES)
  currency: CurrencyCode;

  @IsOptional()
  @IsIn(PAYMENT_PROVIDERS)
  provider?: PaymentProviderKey;
}

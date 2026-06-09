import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class PlanPricesDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  AED?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  EGP?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  USD?: number;
}

export class UpdatePlanDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  tagline?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PlanPricesDto)
  prices?: PlanPricesDto;

  @IsOptional()
  @IsString()
  period?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @IsOptional()
  @IsString()
  cta?: string;

  @IsOptional()
  @IsBoolean()
  highlight?: boolean;
}

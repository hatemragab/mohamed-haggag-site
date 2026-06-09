import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import { CATEGORY_LEVELS, CategoryLevel } from '../category.schema';

export class CreateCategoryDto {
  @IsString()
  @MinLength(2, { message: 'أدخل اسم القسم' })
  title: string;

  @IsOptional()
  @IsString()
  tagline?: string;

  @IsOptional()
  @IsString()
  desc?: string;

  @IsOptional()
  @IsString()
  glyph?: string;

  @IsIn(CATEGORY_LEVELS)
  level: CategoryLevel;
}

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  title?: string;

  @IsOptional()
  @IsString()
  tagline?: string;

  @IsOptional()
  @IsString()
  desc?: string;

  @IsOptional()
  @IsString()
  glyph?: string;

  @IsOptional()
  @IsIn(CATEGORY_LEVELS)
  level?: CategoryLevel;
}

export class AddLevelDto {
  @IsOptional()
  @IsString()
  groupKey?: string;

  @IsString()
  @MinLength(1, { message: 'أدخل اسم المستوى' })
  title: string;

  @IsOptional()
  @IsString()
  note?: string;
}

export class UpdateLevelDto {
  @IsOptional()
  @IsString()
  groupKey?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @IsOptional()
  @IsString()
  note?: string;
}

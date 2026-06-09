import {
  ArrayNotEmpty,
  IsMongoId,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateTestimonialDto {
  @IsString()
  @MinLength(1, { message: 'أدخل الاسم' })
  name: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsString()
  @MinLength(1, { message: 'أدخل نص التقييم' })
  text: string;
}

export class UpdateTestimonialDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  text?: string;
}

export class ReorderTestimonialsDto {
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  orderedIds: string[];
}

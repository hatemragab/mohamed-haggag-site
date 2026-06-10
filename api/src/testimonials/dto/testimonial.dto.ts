import {
  ArrayNotEmpty,
  IsMongoId,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { MK } from '../../i18n/messages';

export class CreateTestimonialDto {
  @IsString()
  @MinLength(1, { message: MK.nameRequired })
  name: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsString()
  @MinLength(1, { message: MK.testimonialTextRequired })
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

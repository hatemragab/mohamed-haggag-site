import {
  ArrayNotEmpty,
  IsBoolean,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateLessonDto {
  @IsMongoId()
  categoryId: string;

  @IsOptional()
  @IsString()
  groupKey?: string;

  @IsString()
  levelKey: string;

  @IsString()
  @MinLength(1, { message: 'أدخل عنوان الدرس' })
  title: string;

  /** Full YouTube URL or bare 11-char id — the id is extracted server-side. */
  @IsString()
  youtube: string;

  @IsNumber()
  @Min(1, { message: 'المدة دقيقة واحدة على الأقل' })
  durationMinutes: number;

  @IsOptional()
  @IsBoolean()
  free?: boolean;
}

export class UpdateLessonDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @IsOptional()
  @IsString()
  youtube?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  durationMinutes?: number;

  @IsOptional()
  @IsBoolean()
  free?: boolean;
}

export class ReorderLessonsDto {
  @IsMongoId()
  categoryId: string;

  @IsOptional()
  @IsString()
  groupKey?: string;

  @IsString()
  levelKey: string;

  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  orderedIds: string[];
}

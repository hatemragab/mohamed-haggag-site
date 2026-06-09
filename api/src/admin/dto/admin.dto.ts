import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @MinLength(3, { message: 'يرجى إدخال الاسم كاملاً' })
  name: string;

  @IsEmail({}, { message: 'بريد إلكتروني غير صحيح' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'كلمة المرور ٦ أحرف على الأقل' })
  password: string;

  @IsOptional()
  @IsString()
  phone?: string;

  /** Grant access to all tracks immediately (e.g. manual/offline payment). */
  @IsOptional()
  @IsBoolean()
  grantAll?: boolean;
}

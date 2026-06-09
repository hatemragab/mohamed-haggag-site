import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
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
}

export class LoginDto {
  @IsEmail({}, { message: 'بريد إلكتروني غير صحيح' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'أدخل كلمة المرور' })
  password: string;
}

export class AdminLoginDto {
  /** Username or email — the prototype admin signs in as «admin». */
  @IsString()
  @IsNotEmpty({ message: 'أدخل اسم المستخدم' })
  identifier: string;

  @IsString()
  @IsNotEmpty({ message: 'أدخل كلمة المرور' })
  password: string;
}

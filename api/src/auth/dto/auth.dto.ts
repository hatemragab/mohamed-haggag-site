import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { MK } from '../../i18n/messages';

export class RegisterDto {
  @IsString()
  @MinLength(3, { message: MK.nameMin })
  name: string;

  @IsEmail({}, { message: MK.email })
  email: string;

  @IsString()
  @MinLength(6, { message: MK.passwordMin })
  password: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class LoginDto {
  @IsEmail({}, { message: MK.email })
  email: string;

  @IsString()
  @IsNotEmpty({ message: MK.passwordRequired })
  password: string;
}

export class AdminLoginDto {
  /** Username or email — the prototype admin signs in as «admin». */
  @IsString()
  @IsNotEmpty({ message: MK.usernameRequired })
  identifier: string;

  @IsString()
  @IsNotEmpty({ message: MK.passwordRequired })
  password: string;
}

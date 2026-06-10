import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { MK } from '../../i18n/messages';

export class CreateStudentDto {
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

  /** Grant access to all tracks immediately (e.g. manual/offline payment). */
  @IsOptional()
  @IsBoolean()
  grantAll?: boolean;
}

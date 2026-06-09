import { Body, Controller, Get, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiTags } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { Model } from 'mongoose';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import {
  ContactMessage,
  ContactMessageDocument,
} from './contact-message.schema';

class ContactDto {
  @IsString()
  @MinLength(2, { message: 'أدخل اسمك' })
  name: string;

  @IsEmail({}, { message: 'بريد إلكتروني غير صحيح' })
  email: string;

  @IsString()
  @MinLength(5, { message: 'اكتب رسالتك' })
  message: string;
}

@ApiTags('contact')
@Controller('contact')
export class ContactController {
  constructor(
    @InjectModel(ContactMessage.name)
    private readonly messages: Model<ContactMessageDocument>,
  ) {}

  @Public()
  @Post()
  async create(@Body() dto: ContactDto) {
    await this.messages.create(dto);
    return { ok: true };
  }

  @Roles('admin')
  @Get()
  list() {
    return this.messages.find().sort({ createdAt: -1 }).limit(200).exec();
  }
}

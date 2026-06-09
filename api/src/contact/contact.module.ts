import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactMessage, ContactMessageSchema } from './contact-message.schema';
import { ContactController } from './contact.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ContactMessage.name, schema: ContactMessageSchema },
    ]),
  ],
  controllers: [ContactController],
})
export class ContactModule {}

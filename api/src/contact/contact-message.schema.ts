import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class ContactMessage {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  message: string;
}

export type ContactMessageDocument = HydratedDocument<ContactMessage>;
export const ContactMessageSchema =
  SchemaFactory.createForClass(ContactMessage);

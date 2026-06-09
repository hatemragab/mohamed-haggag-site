import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Testimonial {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ default: '' })
  role: string;

  @Prop({ required: true })
  text: string;

  /** Display order — the first 3 appear on the homepage. */
  @Prop({ required: true })
  order: number;
}

export type TestimonialDocument = HydratedDocument<Testimonial>;
export const TestimonialSchema = SchemaFactory.createForClass(Testimonial);

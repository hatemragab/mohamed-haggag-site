import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export const CATEGORY_LEVELS = [
  'تأسيسي',
  'مدرسي',
  'أزهري',
  'متدرّج',
  'قرآني',
] as const;
export type CategoryLevel = (typeof CATEGORY_LEVELS)[number];

/** A sub-level inside a category (e.g. «الصف الأول الابتدائي»). */
@Schema({ _id: false })
export class LevelSub {
  @Prop({ required: true })
  key: string;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ default: '' })
  note: string;
}
export const LevelSubSchema = SchemaFactory.createForClass(LevelSub);

/** A named group of levels (only Azhar uses groups: المواد العربية / المواد الشرعية). */
@Schema({ _id: false })
export class LevelGroup {
  @Prop({ required: true })
  key: string;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ type: [LevelSubSchema], default: [] })
  levels: LevelSub[];
}
export const LevelGroupSchema = SchemaFactory.createForClass(LevelGroup);

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ default: '' })
  tagline: string;

  @Prop({ default: '' })
  desc: string;

  /** Single decorative Arabic glyph shown on cards. */
  @Prop({ default: '✦' })
  glyph: string;

  @Prop({ type: String, enum: CATEGORY_LEVELS, required: true })
  level: CategoryLevel;

  @Prop({ default: 0 })
  order: number;

  /** When present, levels live inside groups and `levels` is empty. */
  @Prop({ type: [LevelGroupSchema], default: undefined })
  groups?: LevelGroup[];

  @Prop({ type: [LevelSubSchema], default: [] })
  levels: LevelSub[];
}

export type CategoryDocument = HydratedDocument<Category>;
export const CategorySchema = SchemaFactory.createForClass(Category);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Lesson {
  @Prop({ type: Types.ObjectId, ref: 'Category', required: true, index: true })
  category: Types.ObjectId;

  /** Group key when the category uses groups (Azhar), otherwise null. */
  @Prop({ type: String, default: null })
  groupKey: string | null;

  @Prop({ required: true })
  levelKey: string;

  @Prop({ required: true, trim: true })
  title: string;

  /**
   * The validated 11-char YouTube id of the unlisted video.
   * NEVER serialized in public payloads — only via the gated /watch endpoint.
   */
  @Prop({ required: true, match: /^[\w-]{11}$/ })
  youtubeId: string;

  @Prop({ required: true, min: 1 })
  durationMinutes: number;

  /** Free preview lesson (first lesson of each level). */
  @Prop({ default: false })
  free: boolean;

  @Prop({ required: true })
  order: number;
}

export type LessonDocument = HydratedDocument<Lesson>;
export const LessonSchema = SchemaFactory.createForClass(Lesson);
LessonSchema.index({ category: 1, groupKey: 1, levelKey: 1, order: 1 });

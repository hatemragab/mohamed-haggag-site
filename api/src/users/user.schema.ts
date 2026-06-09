import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserRole = 'student' | 'admin';
export type UserStatus = 'active' | 'suspended';

@Schema({ _id: false })
export class ContinueItem {
  @Prop({ type: Types.ObjectId, ref: 'Lesson', required: true })
  lesson: Types.ObjectId;

  @Prop({ required: true })
  at: Date;
}
export const ContinueItemSchema = SchemaFactory.createForClass(ContinueItem);

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  /** Only the seeded admin has a username (prototype: admin / admin123). */
  @Prop({ unique: true, sparse: true, trim: true })
  username?: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop()
  phone?: string;

  @Prop({ type: String, enum: ['student', 'admin'], default: 'student' })
  role: UserRole;

  @Prop({ type: String, enum: ['active', 'suspended'], default: 'active' })
  status: UserStatus;

  @Prop({ default: false })
  unlockedAll: boolean;

  @Prop({ type: [Types.ObjectId], ref: 'Category', default: [] })
  unlockedCategories: Types.ObjectId[];

  /** Completed lesson ids. */
  @Prop({ type: [Types.ObjectId], ref: 'Lesson', default: [] })
  progress: Types.ObjectId[];

  /** Last 8 watched lessons, newest first. */
  @Prop({ type: [ContinueItemSchema], default: [] })
  continueWatching: ContinueItem[];

  @Prop()
  refreshTokenHash?: string;
}

export type UserDocument = HydratedDocument<User> & {
  createdAt: Date;
  updatedAt: Date;
};
export const UserSchema = SchemaFactory.createForClass(User);

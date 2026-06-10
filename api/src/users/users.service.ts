import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MK } from '../i18n/messages';
import { PlanKey } from '../plans/plan.schema';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly model: Model<UserDocument>,
  ) {}

  findByEmail(email: string) {
    return this.model.findOne({ email: email.toLowerCase() }).exec();
  }

  findByEmailOrUsername(identifier: string) {
    const id = identifier.trim();
    return this.model
      .findOne({ $or: [{ email: id.toLowerCase() }, { username: id }] })
      .exec();
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.model.findById(id).exec();
    if (!user) throw new NotFoundException(MK.userNotFound);
    return user;
  }

  create(data: Partial<User>) {
    return this.model.create(data);
  }

  async setRefreshTokenHash(id: string, hash: string | null) {
    await this.model
      .updateOne({ _id: id }, { $set: { refreshTokenHash: hash } })
      .exec();
  }

  /** Apply a successful purchase to the user's unlocks. */
  async applyUnlock(
    userId: string,
    planKey: PlanKey,
    categoryId?: string | null,
  ) {
    if (planKey === 'monthly' || planKey === 'bundle') {
      await this.model
        .updateOne({ _id: userId }, { $set: { unlockedAll: true } })
        .exec();
    } else if (categoryId) {
      await this.model
        .updateOne(
          { _id: userId },
          { $addToSet: { unlockedCategories: new Types.ObjectId(categoryId) } },
        )
        .exec();
    }
  }

  isUnlocked(user: UserDocument, categoryId: string): boolean {
    return (
      user.role === 'admin' ||
      user.unlockedAll ||
      user.unlockedCategories.some((c) => c.toString() === categoryId)
    );
  }

  async toggleProgress(userId: string, lessonId: string): Promise<boolean> {
    const user = await this.findById(userId);
    const has = user.progress.some((p) => p.toString() === lessonId);
    await this.model
      .updateOne(
        { _id: userId },
        has
          ? { $pull: { progress: new Types.ObjectId(lessonId) } }
          : { $addToSet: { progress: new Types.ObjectId(lessonId) } },
      )
      .exec();
    return !has;
  }

  /** Keep the last 8 watched lessons, newest first, deduped. */
  async pushContinueWatching(userId: string, lessonId: string) {
    const user = await this.findById(userId);
    const rest = user.continueWatching.filter(
      (c) => c.lesson.toString() !== lessonId,
    );
    const next = [
      { lesson: new Types.ObjectId(lessonId), at: new Date() },
      ...rest,
    ].slice(0, 8);
    await this.model
      .updateOne({ _id: userId }, { $set: { continueWatching: next } })
      .exec();
  }
}

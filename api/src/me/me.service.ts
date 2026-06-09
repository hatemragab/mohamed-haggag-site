import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from '../categories/category.schema';
import { Lesson, LessonDocument } from '../lessons/lesson.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class MeService {
  constructor(
    private readonly users: UsersService,
    @InjectModel(Lesson.name) private readonly lessons: Model<LessonDocument>,
    @InjectModel(Category.name)
    private readonly categories: Model<CategoryDocument>,
  ) {}

  /** Everything the student dashboard + category pages need about "me". */
  async summary(userId: string) {
    const user = await this.users.findById(userId);
    const lessonIds = user.continueWatching.map((c) => c.lesson);
    const lessons = await this.lessons.find({ _id: { $in: lessonIds } }).exec();
    const lessonMap = new Map(lessons.map((l) => [l._id.toString(), l]));
    const catIds = [...new Set(lessons.map((l) => l.category.toString()))];
    const cats = await this.categories.find({ _id: { $in: catIds } }).exec();
    const catMap = new Map(cats.map((c) => [c._id.toString(), c]));

    const continueWatching = user.continueWatching.flatMap((c) => {
      const lesson = lessonMap.get(c.lesson.toString());
      if (!lesson) return [];
      const cat = catMap.get(lesson.category.toString());
      if (!cat) return [];
      const levels =
        lesson.groupKey && cat.groups
          ? (cat.groups.find((g) => g.key === lesson.groupKey)?.levels ?? [])
          : cat.levels;
      const level = levels.find((l) => l.key === lesson.levelKey);
      return [
        {
          lessonId: lesson._id.toString(),
          title: lesson.title,
          durationMinutes: lesson.durationMinutes,
          categorySlug: cat.slug,
          categoryTitle: cat.title,
          levelTitle: level?.title ?? '',
          at: c.at,
        },
      ];
    });

    return {
      unlockedAll: user.unlockedAll,
      unlockedCategories: user.unlockedCategories.map((c) => c.toString()),
      progress: user.progress.map((p) => p.toString()),
      continueWatching,
    };
  }

  async toggleProgress(userId: string, lessonId: string) {
    const done = await this.users.toggleProgress(userId, lessonId);
    return { lessonId, done };
  }

  async pushContinue(userId: string, lessonId: string) {
    await this.lessons.findById(lessonId).orFail().exec();
    await this.users.pushContinueWatching(userId, lessonId);
    return { ok: true };
  }
}

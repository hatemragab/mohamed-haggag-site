import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category, CategoryDocument } from '../categories/category.schema';
import { JwtUser } from '../common/decorators/current-user.decorator';
import { extractYoutubeId } from '../common/utils/youtube';
import { UsersService } from '../users/users.service';
import {
  CreateLessonDto,
  ReorderLessonsDto,
  UpdateLessonDto,
} from './dto/lesson.dto';
import { Lesson, LessonDocument } from './lesson.schema';

@Injectable()
export class LessonsService {
  constructor(
    @InjectModel(Lesson.name) private readonly lessons: Model<LessonDocument>,
    @InjectModel(Category.name)
    private readonly categories: Model<CategoryDocument>,
    private readonly users: UsersService,
  ) {}

  private adminView(l: LessonDocument) {
    return {
      id: l._id.toString(),
      categoryId: l.category.toString(),
      groupKey: l.groupKey,
      levelKey: l.levelKey,
      title: l.title,
      youtubeId: l.youtubeId,
      durationMinutes: l.durationMinutes,
      free: l.free,
      order: l.order,
    };
  }

  /** Admin listing for one level — the only list endpoint that exposes youtubeId. */
  async adminList(categoryId: string, levelKey: string, groupKey?: string) {
    // Mongoose 9 no longer casts string ids on ref paths in filters — cast explicitly.
    const list = await this.lessons
      .find({
        category: new Types.ObjectId(categoryId),
        groupKey: groupKey ?? null,
        levelKey,
      })
      .sort({ order: 1 })
      .exec();
    return list.map((l) => this.adminView(l));
  }

  async findById(id: string): Promise<LessonDocument> {
    const lesson = await this.lessons.findById(id).exec();
    if (!lesson) throw new NotFoundException('الدرس غير موجود');
    return lesson;
  }

  /**
   * Lesson page context: meta + sibling playlist + category/level titles.
   * Never includes any youtubeId.
   */
  async context(id: string) {
    const lesson = await this.findById(id);
    const cat = await this.categories.findById(lesson.category).exec();
    if (!cat) throw new NotFoundException('القسم غير موجود');
    const siblings = await this.lessons
      .find({
        category: lesson.category,
        groupKey: lesson.groupKey,
        levelKey: lesson.levelKey,
      })
      .sort({ order: 1 })
      .exec();

    const levels =
      lesson.groupKey && cat.groups
        ? (cat.groups.find((g) => g.key === lesson.groupKey)?.levels ?? [])
        : cat.levels;
    const level = levels.find((l) => l.key === lesson.levelKey);

    return {
      lesson: {
        id: lesson._id.toString(),
        title: lesson.title,
        durationMinutes: lesson.durationMinutes,
        free: lesson.free,
        order: lesson.order,
      },
      category: {
        id: cat._id.toString(),
        slug: cat.slug,
        title: cat.title,
      },
      level: { key: lesson.levelKey, title: level?.title ?? '' },
      groupKey: lesson.groupKey,
      siblings: siblings.map((l) => ({
        id: l._id.toString(),
        title: l.title,
        durationMinutes: l.durationMinutes,
        free: l.free,
        order: l.order,
      })),
    };
  }

  /**
   * THE gating rule: return the youtubeId only when the lesson is free,
   * or the requester is an admin / has unlocked the category.
   */
  async watch(id: string, user?: JwtUser) {
    const lesson = await this.findById(id);
    if (lesson.free) return { youtubeId: lesson.youtubeId };
    if (!user)
      throw new ForbiddenException(
        'سجّل الدخول وافتح المسار لمشاهدة هذا الدرس',
      );
    const doc = await this.users.findById(user.sub);
    if (doc.status === 'suspended')
      throw new ForbiddenException('هذا الحساب موقوف — تواصل مع الإدارة');
    if (!this.users.isUnlocked(doc, lesson.category.toString()))
      throw new ForbiddenException('هذا الدرس مغلق — افتح المسار لمشاهدته');
    return { youtubeId: lesson.youtubeId };
  }

  async create(dto: CreateLessonDto) {
    const youtubeId = extractYoutubeId(dto.youtube);
    if (!youtubeId)
      throw new BadRequestException(
        'لم يتم التعرّف على مُعرّف يوتيوب صحيح — تأكد من الرابط',
      );
    const cat = await this.categories.findById(dto.categoryId).exec();
    if (!cat) throw new NotFoundException('القسم غير موجود');
    const groupKey = dto.groupKey ?? null;
    const last = await this.lessons
      .findOne({ category: cat._id, groupKey, levelKey: dto.levelKey })
      .sort({ order: -1 })
      .select('order')
      .exec();
    const lesson = await this.lessons.create({
      category: cat._id,
      groupKey,
      levelKey: dto.levelKey,
      title: dto.title.trim(),
      youtubeId,
      durationMinutes: dto.durationMinutes,
      free: dto.free ?? false,
      order: (last?.order ?? 0) + 1,
    });
    return this.adminView(lesson);
  }

  async update(id: string, dto: UpdateLessonDto) {
    const lesson = await this.findById(id);
    if (dto.youtube !== undefined) {
      const youtubeId = extractYoutubeId(dto.youtube);
      if (!youtubeId)
        throw new BadRequestException(
          'لم يتم التعرّف على مُعرّف يوتيوب صحيح — تأكد من الرابط',
        );
      lesson.youtubeId = youtubeId;
    }
    if (dto.title !== undefined) lesson.title = dto.title.trim();
    if (dto.durationMinutes !== undefined)
      lesson.durationMinutes = dto.durationMinutes;
    if (dto.free !== undefined) lesson.free = dto.free;
    await lesson.save();
    return this.adminView(lesson);
  }

  async remove(id: string) {
    const lesson = await this.findById(id);
    await lesson.deleteOne();
    await this.normalizeOrder(
      lesson.category.toString(),
      lesson.groupKey,
      lesson.levelKey,
    );
    return { ok: true };
  }

  async reorder(dto: ReorderLessonsDto) {
    const groupKey = dto.groupKey ?? null;
    const list = await this.lessons
      .find({
        category: new Types.ObjectId(dto.categoryId),
        groupKey,
        levelKey: dto.levelKey,
      })
      .exec();
    const byId = new Map(list.map((l) => [l._id.toString(), l]));
    if (
      dto.orderedIds.length !== list.length ||
      dto.orderedIds.some((id) => !byId.has(id))
    )
      throw new BadRequestException('قائمة الترتيب غير مطابقة لدروس المستوى');
    await Promise.all(
      dto.orderedIds.map((id, i) =>
        this.lessons.updateOne({ _id: id }, { $set: { order: i + 1 } }).exec(),
      ),
    );
    return this.adminList(dto.categoryId, dto.levelKey, dto.groupKey);
  }

  private async normalizeOrder(
    categoryId: string,
    groupKey: string | null,
    levelKey: string,
  ) {
    const list = await this.lessons
      .find({ category: new Types.ObjectId(categoryId), groupKey, levelKey })
      .sort({ order: 1 })
      .exec();
    await Promise.all(
      list.map((l, i) =>
        this.lessons
          .updateOne({ _id: l._id }, { $set: { order: i + 1 } })
          .exec(),
      ),
    );
  }

  countAll() {
    return this.lessons.countDocuments().exec();
  }
}

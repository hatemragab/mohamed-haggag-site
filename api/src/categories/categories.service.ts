import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MK } from '../i18n/messages';
import { Lesson, LessonDocument } from '../lessons/lesson.schema';
import { Category, CategoryDocument, LevelSub } from './category.schema';
import {
  AddLevelDto,
  CreateCategoryDto,
  UpdateCategoryDto,
  UpdateLevelDto,
} from './dto/category.dto';

export interface PublicLesson {
  id: string;
  title: string;
  durationMinutes: number;
  free: boolean;
  order: number;
}

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private readonly categories: Model<CategoryDocument>,
    @InjectModel(Lesson.name) private readonly lessons: Model<LessonDocument>,
  ) {}

  private levelsCount(cat: Category): number {
    return cat.groups
      ? cat.groups.reduce((a, g) => a + g.levels.length, 0)
      : cat.levels.length;
  }

  async list() {
    const cats = await this.categories.find().sort({ order: 1 }).exec();
    return cats.map((c) => ({
      id: c._id.toString(),
      slug: c.slug,
      title: c.title,
      tagline: c.tagline,
      desc: c.desc,
      glyph: c.glyph,
      level: c.level,
      order: c.order,
      levelsCount: this.levelsCount(c),
      groups: c.groups?.map((g) => ({ key: g.key, title: g.title })),
    }));
  }

  async findBySlug(slug: string): Promise<CategoryDocument> {
    const cat = await this.categories.findOne({ slug }).exec();
    if (!cat) throw new NotFoundException(MK.categoryNotFound);
    return cat;
  }

  async findById(id: string): Promise<CategoryDocument> {
    const cat = await this.categories.findById(id).exec();
    if (!cat) throw new NotFoundException(MK.categoryNotFound);
    return cat;
  }

  /** Full category tree with per-level lesson lists — WITHOUT youtubeId. */
  async detail(slug: string) {
    const cat = await this.findBySlug(slug);
    const lessons = await this.lessons
      .find({ category: cat._id })
      .sort({ order: 1 })
      .exec();

    const lessonsFor = (groupKey: string | null, levelKey: string) =>
      lessons
        .filter((l) => l.groupKey === groupKey && l.levelKey === levelKey)
        .map(
          (l): PublicLesson => ({
            id: l._id.toString(),
            title: l.title,
            durationMinutes: l.durationMinutes,
            free: l.free,
            order: l.order,
          }),
        );

    const mapLevel = (groupKey: string | null) => (lvl: LevelSub) => {
      const ls = lessonsFor(groupKey, lvl.key);
      return {
        key: lvl.key,
        title: lvl.title,
        note: lvl.note,
        lessons: ls,
        totalMinutes: ls.reduce((a, l) => a + l.durationMinutes, 0),
      };
    };

    return {
      id: cat._id.toString(),
      slug: cat.slug,
      title: cat.title,
      tagline: cat.tagline,
      desc: cat.desc,
      glyph: cat.glyph,
      level: cat.level,
      groups: cat.groups?.map((g) => ({
        key: g.key,
        title: g.title,
        levels: g.levels.map(mapLevel(g.key)),
      })),
      levels: cat.levels.map(mapLevel(null)),
    };
  }

  async create(dto: CreateCategoryDto) {
    const last = await this.categories
      .findOne()
      .sort({ order: -1 })
      .select('order')
      .exec();
    return this.categories.create({
      slug: `c${Date.now()}`,
      title: dto.title.trim(),
      tagline: dto.tagline ?? '',
      desc: dto.desc ?? '',
      glyph: dto.glyph?.trim() || '✦',
      level: dto.level,
      order: (last?.order ?? 0) + 1,
      levels: [],
    });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const cat = await this.findById(id);
    Object.assign(cat, dto);
    return cat.save();
  }

  async remove(id: string) {
    const cat = await this.findById(id);
    await this.lessons.deleteMany({ category: cat._id }).exec();
    await cat.deleteOne();
    return { ok: true };
  }

  private levelArray(cat: CategoryDocument, groupKey?: string): LevelSub[] {
    if (cat.groups && cat.groups.length > 0) {
      const group = cat.groups.find((g) => g.key === groupKey);
      if (!group) throw new BadRequestException(MK.groupNotFound);
      return group.levels;
    }
    return cat.levels;
  }

  async addLevel(id: string, dto: AddLevelDto) {
    const cat = await this.findById(id);
    const arr = this.levelArray(cat, dto.groupKey);
    arr.push({
      key: `sub${Date.now()}`,
      title: dto.title.trim(),
      note: dto.note ?? '',
    });
    cat.markModified('groups');
    cat.markModified('levels');
    await cat.save();
    return this.detail(cat.slug);
  }

  async updateLevel(id: string, levelKey: string, dto: UpdateLevelDto) {
    const cat = await this.findById(id);
    const arr = this.levelArray(cat, dto.groupKey);
    const lvl = arr.find((l) => l.key === levelKey);
    if (!lvl) throw new NotFoundException(MK.levelNotFound);
    if (dto.title !== undefined) lvl.title = dto.title.trim();
    if (dto.note !== undefined) lvl.note = dto.note;
    cat.markModified('groups');
    cat.markModified('levels');
    await cat.save();
    return this.detail(cat.slug);
  }

  async removeLevel(id: string, levelKey: string, groupKey?: string) {
    const cat = await this.findById(id);
    const arr = this.levelArray(cat, groupKey);
    const idx = arr.findIndex((l) => l.key === levelKey);
    if (idx === -1) throw new NotFoundException(MK.levelNotFound);
    arr.splice(idx, 1);
    cat.markModified('groups');
    cat.markModified('levels');
    await cat.save();
    await this.lessons
      .deleteMany({
        category: cat._id,
        groupKey: groupKey ?? null,
        levelKey,
      })
      .exec();
    return this.detail(cat.slug);
  }
}

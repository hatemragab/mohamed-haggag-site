import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MK } from '../i18n/messages';
import {
  CreateTestimonialDto,
  ReorderTestimonialsDto,
  UpdateTestimonialDto,
} from './dto/testimonial.dto';
import { Testimonial, TestimonialDocument } from './testimonial.schema';

@Injectable()
export class TestimonialsService {
  constructor(
    @InjectModel(Testimonial.name)
    private readonly testimonials: Model<TestimonialDocument>,
  ) {}

  private view(t: TestimonialDocument) {
    return {
      id: t._id.toString(),
      name: t.name,
      role: t.role,
      text: t.text,
      order: t.order,
    };
  }

  async list() {
    const list = await this.testimonials.find().sort({ order: 1 }).exec();
    return list.map((t) => this.view(t));
  }

  /** New testimonials go to the top (prototype unshifts), then re-number. */
  async create(dto: CreateTestimonialDto) {
    await this.testimonials.updateMany({}, { $inc: { order: 1 } }).exec();
    await this.testimonials.create({ ...dto, role: dto.role ?? '', order: 1 });
    return this.list();
  }

  async update(id: string, dto: UpdateTestimonialDto) {
    const t = await this.testimonials.findById(id).exec();
    if (!t) throw new NotFoundException(MK.testimonialNotFound);
    Object.assign(t, dto);
    await t.save();
    return this.list();
  }

  async remove(id: string) {
    const res = await this.testimonials.deleteOne({ _id: id }).exec();
    if (res.deletedCount === 0)
      throw new NotFoundException(MK.testimonialNotFound);
    await this.normalize();
    return this.list();
  }

  async reorder(dto: ReorderTestimonialsDto) {
    await Promise.all(
      dto.orderedIds.map((id, i) =>
        this.testimonials
          .updateOne({ _id: id }, { $set: { order: i + 1 } })
          .exec(),
      ),
    );
    return this.list();
  }

  private async normalize() {
    const list = await this.testimonials.find().sort({ order: 1 }).exec();
    await Promise.all(
      list.map((t, i) =>
        this.testimonials
          .updateOne({ _id: t._id }, { $set: { order: i + 1 } })
          .exec(),
      ),
    );
  }
}

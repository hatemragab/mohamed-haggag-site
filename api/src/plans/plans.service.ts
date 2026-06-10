import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MK } from '../i18n/messages';
import { UpdatePlanDto } from './dto/plan.dto';
import { Plan, PlanDocument, PlanKey } from './plan.schema';

@Injectable()
export class PlansService {
  constructor(
    @InjectModel(Plan.name) private readonly plans: Model<PlanDocument>,
  ) {}

  list() {
    return this.plans.find().sort({ order: 1 }).exec();
  }

  async byKey(key: PlanKey): Promise<PlanDocument> {
    const plan = await this.plans.findOne({ key }).exec();
    if (!plan) throw new NotFoundException(MK.planNotFound);
    return plan;
  }

  async update(key: PlanKey, dto: UpdatePlanDto) {
    const plan = await this.byKey(key);
    // Spreading a Mongoose subdocument yields internals, not values — merge per field.
    if (dto.prices) {
      plan.prices = {
        AED: dto.prices.AED ?? plan.prices.AED,
        EGP: dto.prices.EGP ?? plan.prices.EGP,
        USD: dto.prices.USD ?? plan.prices.USD,
      };
    }
    if (dto.name !== undefined) plan.name = dto.name;
    if (dto.tagline !== undefined) plan.tagline = dto.tagline;
    if (dto.period !== undefined) plan.period = dto.period;
    if (dto.features !== undefined) plan.features = dto.features;
    if (dto.cta !== undefined) plan.cta = dto.cta;
    if (dto.highlight !== undefined) plan.highlight = dto.highlight;
    return plan.save();
  }
}

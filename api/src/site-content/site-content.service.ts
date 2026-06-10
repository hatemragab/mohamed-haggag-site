import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MK } from '../i18n/messages';
import { UpdateSiteContentDto } from './dto/site-content.dto';
import { SiteContent, SiteContentDocument } from './site-content.schema';

@Injectable()
export class SiteContentService {
  constructor(
    @InjectModel(SiteContent.name)
    private readonly model: Model<SiteContentDocument>,
  ) {}

  async get(): Promise<SiteContentDocument> {
    const doc = await this.model.findOne({ key: 'main' }).exec();
    if (!doc) throw new NotFoundException(MK.siteContentMissing);
    return doc;
  }

  async update(dto: UpdateSiteContentDto) {
    const $set: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(dto)) if (v !== undefined) $set[k] = v;
    await this.model.updateOne({ key: 'main' }, { $set }).exec();
    return this.get();
  }
}

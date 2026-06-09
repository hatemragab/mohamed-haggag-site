import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ _id: false })
export class Hero {
  @Prop({ required: true }) title: string;
  @Prop({ required: true }) sub: string;
}

@Schema({ _id: false })
export class InstructorStat {
  @Prop({ required: true }) value: number;
  @Prop({ default: '' }) suffix: string;
  @Prop({ required: true }) label: string;
}

@Schema({ _id: false })
export class Instructor {
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) title: string;
  @Prop({ default: '' }) short: string;
  @Prop({ type: [String], default: [] }) bio: string[];
  @Prop({ type: [String], default: [] }) credentials: string[];
  @Prop({ type: [SchemaFactory.createForClass(InstructorStat)], default: [] })
  stats: InstructorStat[];
}

@Schema({ _id: false })
export class WhyCard {
  @Prop({ required: true }) glyph: string;
  @Prop({ required: true }) title: string;
  @Prop({ required: true }) text: string;
}

@Schema({ _id: false })
export class LearnSection {
  @Prop({ required: true }) title: string;
  @Prop({ required: true }) text: string;
  @Prop({ required: true }) quote: string;
}

@Schema({ _id: false })
export class AccessStep {
  @Prop({ required: true }) n: number;
  @Prop({ required: true }) title: string;
  @Prop({ required: true }) text: string;
}

@Schema({ _id: false })
export class FaqItem {
  @Prop({ required: true }) q: string;
  @Prop({ required: true }) a: string;
}

@Schema({ _id: false })
export class ContactInfo {
  @Prop({ required: true }) email: string;
  @Prop({ required: true }) whatsapp: string;
  @Prop({ required: true }) phone: string;
}

@Schema({ _id: false })
export class TermsSection {
  @Prop({ required: true }) title: string;
  @Prop({ required: true }) body: string;
}

/** Singleton document (key = 'main') holding every admin-editable site text. */
@Schema({ timestamps: true })
export class SiteContent {
  @Prop({ required: true, unique: true, default: 'main' })
  key: string;

  @Prop({ type: SchemaFactory.createForClass(Hero), required: true })
  hero: Hero;

  @Prop({ type: SchemaFactory.createForClass(Instructor), required: true })
  instructor: Instructor;

  @Prop({ type: [SchemaFactory.createForClass(WhyCard)], default: [] })
  why: WhyCard[];

  @Prop({ type: SchemaFactory.createForClass(LearnSection), required: true })
  learnSection: LearnSection;

  @Prop({ type: [String], default: [] })
  learn: string[];

  @Prop({ type: [SchemaFactory.createForClass(AccessStep)], default: [] })
  accessSteps: AccessStep[];

  @Prop({ type: [SchemaFactory.createForClass(FaqItem)], default: [] })
  faq: FaqItem[];

  @Prop({ type: SchemaFactory.createForClass(ContactInfo), required: true })
  contact: ContactInfo;

  @Prop({ type: [SchemaFactory.createForClass(TermsSection)], default: [] })
  terms: TermsSection[];

  @Prop({ default: '' })
  footerText: string;
}

export type SiteContentDocument = HydratedDocument<SiteContent>;
export const SiteContentSchema = SchemaFactory.createForClass(SiteContent);

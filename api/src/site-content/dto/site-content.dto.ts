import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { MK } from '../../i18n/messages';

export class HeroDto {
  @IsString() title: string;
  @IsString() sub: string;
}

export class InstructorStatDto {
  @IsNumber() value: number;
  @IsString() suffix: string;
  @IsString() label: string;
}

export class InstructorDto {
  @IsString() name: string;
  @IsString() title: string;
  @IsString() short: string;
  @IsArray() @IsString({ each: true }) bio: string[];
  @IsArray() @IsString({ each: true }) credentials: string[];
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InstructorStatDto)
  stats: InstructorStatDto[];
}

export class WhyCardDto {
  @IsString() glyph: string;
  @IsString() title: string;
  @IsString() text: string;
}

export class LearnSectionDto {
  @IsString() title: string;
  @IsString() text: string;
  @IsString() quote: string;
}

export class AccessStepDto {
  @IsNumber() n: number;
  @IsString() title: string;
  @IsString() text: string;
}

export class FaqItemDto {
  @IsString() q: string;
  @IsString() a: string;
}

export class ContactInfoDto {
  @IsString() email: string;
  @IsString() whatsapp: string;
  @IsString() phone: string;
  // Rendered into href on the public site — restrict to web URLs so a
  // compromised admin account can't store javascript: links ('' = cleared).
  @IsOptional()
  @ValidateIf((_, v: unknown) => v !== '')
  @IsUrl(
    { protocols: ['http', 'https'], require_protocol: true },
    { message: MK.contactLinkInvalid },
  )
  facebook?: string;

  @IsOptional()
  @ValidateIf((_, v: unknown) => v !== '')
  @IsUrl(
    { protocols: ['http', 'https'], require_protocol: true },
    { message: MK.contactLinkInvalid },
  )
  whatsappQr?: string;
}

export class TermsSectionDto {
  @IsString() title: string;
  @IsString() body: string;
}

/** Partial deep update — only the provided sections are replaced. */
export class UpdateSiteContentDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => HeroDto)
  hero?: HeroDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => InstructorDto)
  instructor?: InstructorDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WhyCardDto)
  why?: WhyCardDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => LearnSectionDto)
  learnSection?: LearnSectionDto;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  learn?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AccessStepDto)
  accessSteps?: AccessStepDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FaqItemDto)
  faq?: FaqItemDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => ContactInfoDto)
  contact?: ContactInfoDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TermsSectionDto)
  terms?: TermsSectionDto[];

  @IsOptional()
  @IsString()
  footerText?: string;
}

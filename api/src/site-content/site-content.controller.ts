import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { UpdateSiteContentDto } from './dto/site-content.dto';
import { SiteContentService } from './site-content.service';

@ApiTags('site-content')
@Controller('site-content')
export class SiteContentController {
  constructor(private readonly content: SiteContentService) {}

  @Public()
  @Get()
  get() {
    return this.content.get();
  }

  @Roles('admin')
  @Patch()
  update(@Body() dto: UpdateSiteContentDto) {
    return this.content.update(dto);
  }
}

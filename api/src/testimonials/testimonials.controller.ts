import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import {
  CreateTestimonialDto,
  ReorderTestimonialsDto,
  UpdateTestimonialDto,
} from './dto/testimonial.dto';
import { TestimonialsService } from './testimonials.service';

@ApiTags('testimonials')
@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly testimonials: TestimonialsService) {}

  @Public()
  @Get()
  list() {
    return this.testimonials.list();
  }

  @Roles('admin')
  @Post()
  create(@Body() dto: CreateTestimonialDto) {
    return this.testimonials.create(dto);
  }

  @Roles('admin')
  @Patch('reorder')
  reorder(@Body() dto: ReorderTestimonialsDto) {
    return this.testimonials.reorder(dto);
  }

  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTestimonialDto) {
    return this.testimonials.update(id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testimonials.remove(id);
  }
}

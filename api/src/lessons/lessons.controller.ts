import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  JwtUser,
} from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import {
  CreateLessonDto,
  ReorderLessonsDto,
  UpdateLessonDto,
} from './dto/lesson.dto';
import { LessonsService } from './lessons.service';

@ApiTags('lessons')
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessons: LessonsService) {}

  @Roles('admin')
  @Get()
  adminList(
    @Query('categoryId') categoryId: string,
    @Query('levelKey') levelKey: string,
    @Query('groupKey') groupKey?: string,
  ) {
    return this.lessons.adminList(categoryId, levelKey, groupKey);
  }

  @Roles('admin')
  @Post()
  create(@Body() dto: CreateLessonDto) {
    return this.lessons.create(dto);
  }

  @Roles('admin')
  @Patch('reorder')
  reorder(@Body() dto: ReorderLessonsDto) {
    return this.lessons.reorder(dto);
  }

  @Public()
  @Get(':id/context')
  context(@Param('id') id: string) {
    return this.lessons.context(id);
  }

  @Public()
  @Get(':id/watch')
  watch(@Param('id') id: string, @CurrentUser() user?: JwtUser) {
    return this.lessons.watch(id, user);
  }

  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateLessonDto) {
    return this.lessons.update(id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessons.remove(id);
  }
}

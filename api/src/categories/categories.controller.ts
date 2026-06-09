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
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { CategoriesService } from './categories.service';
import {
  AddLevelDto,
  CreateCategoryDto,
  UpdateCategoryDto,
  UpdateLevelDto,
} from './dto/category.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categories: CategoriesService) {}

  @Public()
  @Get()
  list() {
    return this.categories.list();
  }

  @Public()
  @Get(':slug')
  detail(@Param('slug') slug: string) {
    return this.categories.detail(slug);
  }

  @Roles('admin')
  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.categories.create(dto);
  }

  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categories.update(id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categories.remove(id);
  }

  @Roles('admin')
  @Post(':id/levels')
  addLevel(@Param('id') id: string, @Body() dto: AddLevelDto) {
    return this.categories.addLevel(id, dto);
  }

  @Roles('admin')
  @Patch(':id/levels/:levelKey')
  updateLevel(
    @Param('id') id: string,
    @Param('levelKey') levelKey: string,
    @Body() dto: UpdateLevelDto,
  ) {
    return this.categories.updateLevel(id, levelKey, dto);
  }

  @Roles('admin')
  @Delete(':id/levels/:levelKey')
  removeLevel(
    @Param('id') id: string,
    @Param('levelKey') levelKey: string,
    @Query('groupKey') groupKey?: string,
  ) {
    return this.categories.removeLevel(id, levelKey, groupKey);
  }
}

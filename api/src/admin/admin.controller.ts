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
import { Roles } from '../common/decorators/roles.decorator';
import { AdminService } from './admin.service';
import { CreateStudentDto } from './dto/admin.dto';

@ApiTags('admin')
@Roles('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get('overview')
  overview() {
    return this.admin.overview();
  }

  @Get('students')
  students(@Query('q') q?: string) {
    return this.admin.students(q);
  }

  @Post('students')
  createStudent(@Body() dto: CreateStudentDto) {
    return this.admin.createStudent(dto);
  }

  @Patch('students/:id/status')
  toggleStatus(@Param('id') id: string) {
    return this.admin.toggleStatus(id);
  }

  @Delete('students/:id')
  removeStudent(@Param('id') id: string) {
    return this.admin.removeStudent(id);
  }
}

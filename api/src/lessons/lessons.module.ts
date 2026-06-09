import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from '../categories/category.schema';
import { UsersModule } from '../users/users.module';
import { Lesson, LessonSchema } from './lesson.schema';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: Lesson.name, schema: LessonSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [LessonsController],
  providers: [LessonsService],
  exports: [LessonsService],
})
export class LessonsModule {}

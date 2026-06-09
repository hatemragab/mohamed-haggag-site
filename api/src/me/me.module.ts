import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from '../categories/category.schema';
import { Lesson, LessonSchema } from '../lessons/lesson.schema';
import { UsersModule } from '../users/users.module';
import { MeController } from './me.controller';
import { MeService } from './me.service';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: Lesson.name, schema: LessonSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [MeController],
  providers: [MeService],
})
export class MeModule {}

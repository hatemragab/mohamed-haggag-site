import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from '../categories/category.schema';
import { LessonsModule } from '../lessons/lessons.module';
import { OrdersModule } from '../orders/orders.module';
import { SiteContentModule } from '../site-content/site-content.module';
import { UsersModule } from '../users/users.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    UsersModule,
    LessonsModule,
    OrdersModule,
    SiteContentModule,
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}

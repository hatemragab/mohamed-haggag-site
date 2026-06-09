import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from '../categories/categories.module';
import { PlansModule } from '../plans/plans.module';
import { UsersModule } from '../users/users.module';
import { Order, OrderSchema } from './order.schema';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { PaymobProvider, StripeProvider } from './payments/payment-provider';

@Module({
  imports: [
    UsersModule,
    PlansModule,
    CategoriesModule,
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, PaymobProvider, StripeProvider],
  exports: [OrdersService],
})
export class OrdersModule {}

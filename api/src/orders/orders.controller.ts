import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  JwtUser,
} from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateOrderDto } from './dto/order.dto';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Post()
  create(@CurrentUser() user: JwtUser, @Body() dto: CreateOrderDto) {
    return this.orders.create(user.sub, dto);
  }

  @Post(':id/pay')
  pay(@CurrentUser() user: JwtUser, @Param('id') id: string) {
    return this.orders.pay(user.sub, id);
  }

  @Get('mine')
  mine(@CurrentUser() user: JwtUser) {
    return this.orders.mine(user.sub);
  }

  @Roles('admin')
  @Get()
  adminList() {
    return this.orders.adminList();
  }

  @Roles('admin')
  @Delete(':id')
  adminRemove(@Param('id') id: string) {
    return this.orders.adminRemove(id);
  }
}

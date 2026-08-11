import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('order')
  createOrder(@Body() dto: CreateOrderDto) {
    console.log('createOrder dto:', dto);
    return this.orderService.createOrder(dto);
  }
}

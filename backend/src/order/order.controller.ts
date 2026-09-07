import { Body, Controller, Post, HttpCode } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('order')
  @HttpCode(200)
  createOrder(@Body() dto: CreateOrderDto) {
    return this.orderService.createOrder(dto);
  }
}

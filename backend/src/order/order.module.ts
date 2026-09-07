import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from '../repository/order.repository';
import { MongoOrderRepository } from '../repository/mongo-order.repository';
import { FilmsModule } from '../films/films.module';

@Module({
  imports: [FilmsModule],
  controllers: [OrderController],
  providers: [
    OrderService,
    { provide: OrderRepository, useClass: MongoOrderRepository },
  ],
})
export class OrderModule {}

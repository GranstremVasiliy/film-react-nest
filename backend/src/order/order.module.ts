import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from '../repository/order.repository';
import { ScheduleEntity } from '../films/entities/schedule.entity';
import { PostgresOrderRepository } from '../repository/postgres-order.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ScheduleEntity])],
  controllers: [OrderController],
  providers: [
    OrderService,
    PostgresOrderRepository,
    {
      provide: OrderRepository,
      useClass: PostgresOrderRepository,
    },
  ],
})
export class OrderModule {}

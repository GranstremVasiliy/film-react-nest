import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/order.dto';
import { randomUUID } from 'crypto';
import { OrderRepository } from '../repository/order.repository';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}
  async createOrder(dto: CreateOrderDto) {
    const tickets = dto.tickets;

    if (!Array.isArray(tickets) || tickets.length === 0) {
      throw new BadRequestException('Нет билетов в заказе');
    }

    return this.orderRepository.transaction(async (repository) => {
      const resultTickets = [];

      for (const ticket of tickets) {
        const { film, session, row, seat, daytime, price } = ticket;
        const place = `${row}:${seat}`;

        const schedule = await repository.findScheduleById(session);

        if (!schedule) {
          throw new NotFoundException('Сеанс не найден');
        }

        if (schedule.taken.includes(place)) {
          throw new BadRequestException('Место уже занято');
        }

        const updatedTaken = [...schedule.taken, place];

        await repository.saveTaken(session, updatedTaken);

        resultTickets.push({
          id: randomUUID(),
          film,
          session,
          row,
          seat,
          daytime,
          price,
        });
      }

      return {
        total: resultTickets.length,
        items: resultTickets,
      };
    });
  }
}

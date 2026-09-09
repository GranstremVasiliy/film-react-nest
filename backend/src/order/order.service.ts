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
    const resultTickets = [];

    for (const ticket of tickets) {
      const { film, session, row, seat, daytime, price } = ticket;
      const place = `${row}:${seat}`;
      const schedule = await this.orderRepository.findScheduleById(session);
      if (!schedule) {
        throw new NotFoundException('Сеанс не найден');
      }

      const alreadyTaken = schedule.taken.includes(place);
      if (alreadyTaken) {
        throw new BadRequestException('Место уже занято');
      }

      const updatedTaken = [...schedule.taken, place];
      await this.orderRepository.saveTaken(session, updatedTaken);

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
  }
}

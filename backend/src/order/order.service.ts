import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film, FilmDocument } from '../films/film.schema';
import { CreateOrderDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Film.name)
    private readonly filmModel: Model<FilmDocument>,
  ) {}
  async createOrder(dto: CreateOrderDto) {
    const ticket = dto.tickets[0];
    if (!ticket) {
      throw new BadRequestException('Нет билетов в заказе');
    }

    const { film, session, row, seat } = ticket;
    const place = `${row}:${seat}`;

    const filmDoc = await this.filmModel.findOne({ id: film });

    if (!filmDoc) {
      throw new NotFoundException('Фильм не найден');
    }
    const sessionDoc = filmDoc.schedule.find((s) => s.id === session);
    if (!sessionDoc) {
      throw new NotFoundException('Сеанс не найден');
    }
    const alreadyTaken = sessionDoc.taken.includes(place);
    if (alreadyTaken) {
      throw new BadRequestException('Место уже занято');
    }

    sessionDoc.taken.push(place);
    await filmDoc.save();
    const resultTicket = {
      film,
      session,
      row,
      seat,
    };

    return {
      total: 1,
      items: [resultTicket],
    };
  }
}

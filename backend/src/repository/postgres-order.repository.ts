import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderRepository } from './order.repository';
import { ScheduleItemDto } from '../films/dto/films.dto';
import { ScheduleEntity } from '../films/entities/schedule.entity';

@Injectable()
export class PostgresOrderRepository extends OrderRepository {
  constructor(
    @InjectRepository(ScheduleEntity)
    private readonly scheduleRepository: Repository<ScheduleEntity>,
  ) {
    super();
  }

  async findScheduleById(id: string): Promise<ScheduleItemDto | null> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id },
      relations: {
        film: true,
      },
    });
    if (!schedule) {
      return null;
    }
    return {
      id: schedule.id,
      daytime: schedule.daytime,
      hall: schedule.hall,
      rows: schedule.rows,
      seats: schedule.seats,
      price: schedule.price,
      taken: schedule.taken,
    };
  }

  async saveTaken(scheduleId: string, taken: string[]): Promise<void> {
    await this.scheduleRepository.update({ id: scheduleId }, { taken });
  }
}

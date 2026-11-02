import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { OrderRepository } from './order.repository';
import { ScheduleItemDto } from '../films/dto/films.dto';
import { ScheduleEntity } from '../films/entities/schedule.entity';

@Injectable()
export class PostgresOrderRepository extends OrderRepository {
  constructor(
    @InjectRepository(ScheduleEntity)
    private readonly scheduleRepository: Repository<ScheduleEntity>,
    private readonly dataSource: DataSource,
    private readonly entityManager?: EntityManager,
  ) {
    super();
  }

  async findScheduleById(id: string): Promise<ScheduleItemDto | null> {
    const repository = this.entityManager
      ? this.entityManager.getRepository(ScheduleEntity)
      : this.scheduleRepository;

    const schedule = await repository.findOne({
      where: { id },
      lock: this.entityManager ? { mode: 'pessimistic_write' } : undefined,
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
    const repository = this.entityManager
      ? this.entityManager.getRepository(ScheduleEntity)
      : this.scheduleRepository;

    await repository.update({ id: scheduleId }, { taken });
  }

  async transaction<T>(
    callback: (repository: OrderRepository) => Promise<T>,
  ): Promise<T> {
    return this.dataSource.transaction(async (manager) => {
      const transactionalRepository = new PostgresOrderRepository(
        this.scheduleRepository,
        this.dataSource,
        manager,
      );

      return callback(transactionalRepository);
    });
  }
}

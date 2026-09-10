import { ScheduleItemDto } from '../films/dto/films.dto';

export abstract class OrderRepository {
  abstract findScheduleById(id: string): Promise<ScheduleItemDto | null>;
  abstract saveTaken(scheduleId: string, taken: string[]): Promise<void>;
  abstract transaction<T>(
    fn: (repository: OrderRepository) => Promise<T>,
  ): Promise<T>;
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmEntity } from './entities/film.entity';
import { ScheduleEntity } from './entities/schedule.entity';
import { FilmsRepository } from '../repository/films.repository';
import { PostgresFilmsRepository } from '../repository/postgres-films.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FilmEntity, ScheduleEntity])],
  controllers: [FilmsController],
  providers: [
    FilmsService,
    PostgresFilmsRepository,
    {
      provide: FilmsRepository,
      useClass: PostgresFilmsRepository,
    },
  ],
  exports: [FilmsRepository],
})
export class FilmsModule {}

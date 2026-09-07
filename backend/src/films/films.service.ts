import { Injectable, NotFoundException } from '@nestjs/common';
import { FilmDto, ScheduleItemDto } from './dto/films.dto';
import { FilmsRepository } from '../repository/films.repository';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async getFilms(): Promise<FilmDto[]> {
    return this.filmsRepository.findAll();
  }
  async getScheduleByFilmId(filmId: string): Promise<ScheduleItemDto[]> {
    const film = await this.filmsRepository.findById(filmId);
    if (!film) {
      throw new NotFoundException(`Филь не найден`);
    }
    return film.schedule as ScheduleItemDto[];
  }
}

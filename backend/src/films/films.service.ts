import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film, FilmDocument } from './film.schema';
import { FilmDto, ScheduleItemDto } from './dto/films.dto';

@Injectable()
export class FilmsService {
  constructor(
    @InjectModel(Film.name)
    private readonly filmModel: Model<FilmDocument>,
  ) {}

  async getAllFilms(): Promise<FilmDto[]> {
    const films = await this.filmModel.find();
    return films as FilmDto[];
  }

  async getScheduleByFilmId(filmId: string): Promise<ScheduleItemDto[] | null> {
    const film = await this.filmModel.findOne({ id: filmId });
    if (!film) {
      return null;
    }
    return film.schedule as ScheduleItemDto[];
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film, FilmDocument } from '../films/film.schema';
import { OrderRepository } from './order.repository';

@Injectable()
export class MongoOrderRepository extends OrderRepository {
  constructor(
    @InjectModel(Film.name)
    private readonly filmModel: Model<FilmDocument>,
  ) {
    super();
  }

  async findFilmById(id: string): Promise<FilmDocument | null> {
    return this.filmModel.findOne({ id });
  }

  async saveFilm(film: FilmDocument): Promise<FilmDocument> {
    return film.save();
  }
}

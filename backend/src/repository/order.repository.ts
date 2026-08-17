import { FilmDocument } from '../films/film.schema';

export abstract class OrderRepository {
  abstract findFilmById(id: string): Promise<FilmDocument | null>;
  abstract saveFilm(film: FilmDocument): Promise<FilmDocument>;
}

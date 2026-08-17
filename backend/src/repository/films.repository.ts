import { FilmDto } from '../films/dto/films.dto';
export abstract class FilmsRepository {
  abstract findAll(): Promise<FilmDto[]>;
  abstract findById(id: string): Promise<FilmDto | null>;
}

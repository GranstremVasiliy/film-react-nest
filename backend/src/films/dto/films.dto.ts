// src/films/dto/film.dto.ts

export class ScheduleItemDto {
  id!: string;
  daytime!: string;
  hall!: number;
  rows!: number;
  seats!: number;
  price!: number;
  taken!: string[];
}

export class FilmDto {
  id!: string;
  rating!: number;
  director!: string;
  tags!: string[];
  image!: string;
  cover!: string;
  title!: string;
  about!: string;
  description!: string;
  schedule!: ScheduleItemDto[];
}

export class FilmListItemDto {
  id!: string;
  rating!: number;
  director!: string;
  tags!: string[];
  image!: string;
  cover!: string;
  title!: string;
  about!: string;
  description!: string;
}

export function toFilmListItemDto(film: FilmDto): FilmListItemDto {
  return {
    id: film.id,
    rating: film.rating,
    director: film.director,
    tags: film.tags,
    image: film.image,
    cover: film.cover,
    title: film.title,
    about: film.about,
    description: film.description,
  };
}

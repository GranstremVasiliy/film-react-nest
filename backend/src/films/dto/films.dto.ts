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

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmDto, ScheduleItemDto } from './dto/films.dto';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

describe('FilmsController', () => {
  let controller: FilmsController;

  const filmsServiceMock = {
    getFilms: jest.fn<FilmsService['getFilms']>(),
    getScheduleByFilmId: jest.fn<FilmsService['getScheduleByFilmId']>(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: filmsServiceMock,
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
  });

  describe('getFilms', () => {
    it('возвращает фильмы и их количество, исключая расписание', async () => {
      const film: FilmDto = {
        id: '0e33c7f6-27a7-4aa0-8e61-65d7e5effecf',
        rating: 2.9,
        director: 'Итан Райт',
        tags: ['Документальный'],
        image: '/bg1s.jpg',
        cover: '/bg1c.jpg',
        title: 'Архитекторы общества',
        about: 'Краткое описание',
        description: 'Полное описание',
        schedule: [],
      };

      filmsServiceMock.getFilms.mockResolvedValue([film]);

      const result = await controller.getFilms();

      expect(filmsServiceMock.getFilms).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        total: 1,
        items: [
          {
            id: film.id,
            rating: film.rating,
            director: film.director,
            tags: film.tags,
            image: film.image,
            cover: film.cover,
            title: film.title,
            about: film.about,
            description: film.description,
          },
        ],
      });

      expect(result.items[0]).not.toHaveProperty('schedule');
    });

    it('возвращает пустой список, если фильмов нет', async () => {
      filmsServiceMock.getFilms.mockResolvedValue([]);

      const result = await controller.getFilms();

      expect(result).toEqual({
        total: 0,
        items: [],
      });
    });
  });

  describe('getFilmSchedule', () => {
    const filmId = '0e33c7f6-27a7-4aa0-8e61-65d7e5effecf';

    it('передаёт id сервису и возвращает расписание с количеством', async () => {
      const schedule: ScheduleItemDto[] = [
        {
          id: 'f2e429b0-685d-41f8-a8cd-1d8cb63b99ce',
          daytime: '2024-06-28T10:00:53+03:00',
          hall: 0,
          rows: 5,
          seats: 10,
          price: 350,
          taken: [],
        },
      ];

      filmsServiceMock.getScheduleByFilmId.mockResolvedValue(schedule);

      const result = await controller.getFilmSchedule(filmId);

      expect(filmsServiceMock.getScheduleByFilmId).toHaveBeenCalledTimes(1);
      expect(filmsServiceMock.getScheduleByFilmId).toHaveBeenCalledWith(filmId);

      expect(result).toEqual({
        total: 1,
        items: schedule,
      });
    });

    it('возвращает пустой список, если сеансов нет', async () => {
      filmsServiceMock.getScheduleByFilmId.mockResolvedValue([]);

      const result = await controller.getFilmSchedule(filmId);

      expect(result).toEqual({
        total: 0,
        items: [],
      });
    });

    it('передаёт исключение сервиса, если фильм не найден', async () => {
      const error = new NotFoundException('Фильм не найден');

      filmsServiceMock.getScheduleByFilmId.mockRejectedValue(error);

      await expect(controller.getFilmSchedule(filmId)).rejects.toBe(error);
    });
  });
});

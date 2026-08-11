import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';

@Controller()
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get('films')
  async getFilms() {
    const films = await this.filmsService.getAllFilms();
    return {
      total: films.length,
      items: films,
    };
  }

  @Get('films/:id/schedule')
  async getFilmSchedule(@Param('id') id: string) {
    const schedule = await this.filmsService.getScheduleByFilmId(id);
    return {
      total: schedule.length,
      items: schedule,
    };
  }
}

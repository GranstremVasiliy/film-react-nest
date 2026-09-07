import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import { toFilmListItemDto } from './dto/films.dto';

@Controller()
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get('films')
  async getFilms() {
    const films = await this.filmsService.getFilms();
    const items = films.map(toFilmListItemDto);
    return {
      total: items.length,
      items: items,
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

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { FilmsService } from '../films/films.service';
import { HallsService } from '../halls/halls.service';
import { CreateShowingDto } from './dto/create-showing.dto';

export interface Showing {
  id: string;
  filmId: string;
  hallId: string;
  startsAt: string;
}

@Injectable()
export class ShowingsService {
  private readonly showings: Showing[] = [];

  constructor(
    private readonly filmsService: FilmsService,
    private readonly hallsService: HallsService,
  ) {}

  create(dto: CreateShowingDto): Showing {
    // Перевіряємо, чи існують фільм і зал.
    this.filmsService.findOne(dto.filmId);
    this.hallsService.getHall(dto.hallId);

    const startsAtDate = new Date(dto.startsAt);

    if (Number.isNaN(startsAtDate.getTime())) {
      throw new ConflictException('Некоректна дата початку сеансу');
    }

    const showing: Showing = {
      id: randomUUID(),
      filmId: dto.filmId,
      hallId: dto.hallId,
      startsAt: startsAtDate.toISOString(),
    };

    this.showings.push(showing);
    return showing;
  }

  findAll(): Showing[] {
    return [...this.showings];
  }

  findOne(id: string): Showing {
    const showing = this.showings.find((item) => item.id === id);

    if (!showing) {
      throw new NotFoundException(`Сеанс з id "${id}" не знайдено`);
    }

    return showing;
  }

  findByFilmId(filmId: string): Showing[] {
    return this.showings.filter((item) => item.filmId === filmId);
  }

  findByHallId(hallId: string): Showing[] {
    return this.showings.filter((item) => item.hallId === hallId);
  }

  hasShowingsForFilm(filmId: string): boolean {
    return this.showings.some((item) => item.filmId === filmId);
  }

  hasShowingsForHall(hallId: string): boolean {
    return this.showings.some((item) => item.hallId === hallId);
  }

  remove(id: string): void {
    this.findOne(id);

    const index = this.showings.findIndex((item) => item.id === id);
    this.showings.splice(index, 1);
  }
}

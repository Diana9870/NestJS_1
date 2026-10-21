import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { CreateFilmDto } from './dto/create-film.dto';

export interface Film {
  id: string;
  title: string;
  durationMinutes: number;
  releaseYear: number;
}

@Injectable()
export class FilmsService {
  private readonly films: Film[] = [];

  create(dto: CreateFilmDto): Film {
    const film: Film = {
      id: randomUUID(),
      title: dto.title,
      durationMinutes: dto.durationMinutes,
      releaseYear: dto.releaseYear,
    };

    this.films.push(film);
    return film;
  }

  findAll(): Film[] {
    return [...this.films];
  }

  findOne(id: string): Film {
    const film = this.films.find((item) => item.id === id);

    if (!film) {
      throw new NotFoundException(`Фільм з id "${id}" не знайдено`);
    }

    return film;
  }

  update(id: string, dto: UpdateFilmDto): Film {
    const film = this.findOne(id);
    Object.assign(film, dto);
    return film;
  }

  remove(id: string): void {
    this.findOne(id);

    // Перевірку залежних сеансів додамо після реалізації ShowingsService.
    const index = this.films.findIndex((film) => film.id === id);

    if (index === -1) {
      throw new NotFoundException(`Фільм з id "${id}" не знайдено`);
    }

    this.films.splice(index, 1);
  }

  ensureCanDelete(id: string, hasShowings: boolean): void {
    this.findOne(id);

    if (hasShowings) {
      throw new ConflictException(
        `Неможливо видалити фільм "${id}", оскільки на нього є сеанси`,
      );
    }
  }
}

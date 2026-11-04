import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { Film } from './entities/film.entity';

@Injectable()
export class FilmsService {
  private readonly films: Film[] = [];

  /**
   * Checks that block deletion. A module that references films (showings)
   * registers one here, so FilmsService does not depend on it and the module
   * graph stays acyclic. A guard returns true while the film is still in use.
   */
  private readonly deletionGuards: Array<(filmId: string) => boolean> = [];

  registerDeletionGuard(isInUse: (filmId: string) => boolean): void {
    this.deletionGuards.push(isInUse);
  }

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

  /** Lookup for other modules that need "missing" as a value, not as an error. */
  findById(id: string): Film | undefined {
    return this.films.find((film) => film.id === id);
  }

  findOne(id: string): Film {
    const film = this.findById(id);
    if (!film) {
      throw new NotFoundException(`Film with id ${id} not found`);
    }
    return film;
  }

  update(id: string, dto: UpdateFilmDto): Film {
    const film = this.findOne(id);
    if (dto.title !== undefined) film.title = dto.title;
    if (dto.durationMinutes !== undefined) {
      film.durationMinutes = dto.durationMinutes;
    }
    if (dto.releaseYear !== undefined) film.releaseYear = dto.releaseYear;
    return film;
  }

  remove(id: string): void {
    const film = this.findOne(id);
    if (this.deletionGuards.some((isInUse) => isInUse(id))) {
      throw new ConflictException(
        `Film ${id} cannot be deleted: at least one showing references it`,
      );
    }
    this.films.splice(this.films.indexOf(film), 1);
  }
}

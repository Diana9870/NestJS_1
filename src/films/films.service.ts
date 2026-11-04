import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ShowingsService } from '../showings/showings.service';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { Film } from './entities/film.entity';

@Injectable()
export class FilmsService {
  private readonly films: Film[] = [];

  constructor(
    // Films and showings reference each other (a film cannot be deleted while
    // a showing uses it), hence forwardRef on both sides.
    @Inject(forwardRef(() => ShowingsService))
    private readonly showingsService: ShowingsService,
  ) {}

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
    if (this.showingsService.existsForFilm(id)) {
      throw new ConflictException(
        `Film ${id} cannot be deleted: at least one showing references it`,
      );
    }
    this.films.splice(this.films.indexOf(film), 1);
  }
}

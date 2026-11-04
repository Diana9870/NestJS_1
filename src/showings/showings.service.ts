import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { FilmsService } from '../films/films.service';
import { HallsService } from '../halls/halls.service';
import { CreateShowingDto } from './dto/create-showing.dto';
import { QueryShowingsDto } from './dto/query-showings.dto';
import {
  Showing,
  ShowingView,
  StoredShowing,
} from './entities/showing.entity';

/**
 * Parses an ISO 8601 date-time to epoch ms. A value without an offset
 * (2099-01-01T18:00:00) is read as UTC, never in the server's local zone.
 */
function parseStartsAt(value: string): number {
  const hasOffset = /(Z|[+-]\d{2}(:?\d{2})?)$/i.test(value.split('T')[1] ?? '');
  const isDateTime = value.includes('T');
  return Date.parse(isDateTime && !hasOffset ? `${value}Z` : value);
}

@Injectable()
export class ShowingsService implements OnModuleInit {
  private readonly showings: StoredShowing[] = [];

  constructor(
    private readonly filmsService: FilmsService,
    private readonly hallsService: HallsService,
  ) {}

  /**
   * Films and halls must not be deleted while a showing uses them. Instead of
   * importing this module (a dependency cycle), they accept a guard from us.
   */
  onModuleInit(): void {
    this.filmsService.registerDeletionGuard((id) => this.existsForFilm(id));
    this.hallsService.registerDeletionGuard((id) => this.existsForHall(id));
  }

  create(dto: CreateShowingDto): Showing {
    if (!this.filmsService.findById(dto.filmId)) {
      throw new BadRequestException(`Film with id ${dto.filmId} not found`);
    }
    if (!this.hallsService.findById(dto.hallId)) {
      throw new BadRequestException(`Hall with id ${dto.hallId} not found`);
    }

    const startsAtMs = parseStartsAt(dto.startsAt);
    if (Number.isNaN(startsAtMs)) {
      throw new BadRequestException(
        'startsAt is not a valid ISO 8601 date and time',
      );
    }
    if (startsAtMs <= Date.now()) {
      throw new BadRequestException('startsAt must not be in the past');
    }

    const showing: StoredShowing = {
      id: randomUUID(),
      filmId: dto.filmId,
      hallId: dto.hallId,
      // Returned to clients exactly as they sent it.
      startsAt: dto.startsAt,
      // The real instant (UTC): the date filter and sorting use this, so they
      // do not depend on the offset the client used.
      startsAtMs,
      price: dto.price,
    };
    this.showings.push(showing);
    return this.toPublic(showing);
  }

  findAll(query: QueryShowingsDto): ShowingView[] {
    const { filmId, date } = query;

    return this.showings
      .filter((showing) => filmId === undefined || showing.filmId === filmId)
      .filter(
        (showing) =>
          date === undefined ||
          new Date(showing.startsAtMs).toISOString().slice(0, 10) === date,
      )
      .sort(
        (a, b) =>
          a.startsAtMs - b.startsAtMs ||
          (a.id < b.id ? -1 : a.id > b.id ? 1 : 0),
      )
      .map((showing) => this.toView(showing));
  }

  findOne(id: string): ShowingView {
    return this.toView(this.findEntity(id));
  }

  /** The stored showing (with filmId and hallId), for other modules. Throws 404. */
  findEntity(id: string): StoredShowing {
    const showing = this.showings.find((item) => item.id === id);
    if (!showing) {
      throw new NotFoundException(`Showing with id ${id} not found`);
    }
    return showing;
  }

  existsForFilm(filmId: string): boolean {
    return this.showings.some((showing) => showing.filmId === filmId);
  }

  existsForHall(hallId: string): boolean {
    return this.showings.some((showing) => showing.hallId === hallId);
  }

  /** The showing without the private startsAtMs, for the POST response. */
  private toPublic(showing: StoredShowing): Showing {
    return {
      id: showing.id,
      filmId: showing.filmId,
      hallId: showing.hallId,
      startsAt: showing.startsAt,
      price: showing.price,
    };
  }

  private toView(showing: StoredShowing): ShowingView {
    return {
      id: showing.id,
      filmTitle: this.filmsService.findOne(showing.filmId).title,
      hallName: this.hallsService.findOne(showing.hallId).name,
      startsAt: showing.startsAt,
      price: showing.price,
    };
  }
}

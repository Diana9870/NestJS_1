import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { FilmsService } from '../films/films.service';
import { HallsService } from '../halls/halls.service';
import { CreateShowingDto } from './dto/create-showing.dto';
import { QueryShowingsDto } from './dto/query-showings.dto';
import { Showing, ShowingView } from './entities/showing.entity';

@Injectable()
export class ShowingsService {
  private readonly showings: Showing[] = [];

  constructor(
    // forwardRef: films and halls call back into this service to check
    // whether they are still referenced before they delete anything.
    @Inject(forwardRef(() => FilmsService))
    private readonly filmsService: FilmsService,
    @Inject(forwardRef(() => HallsService))
    private readonly hallsService: HallsService,
  ) {}

  create(dto: CreateShowingDto): Showing {
    if (!this.filmsService.findById(dto.filmId)) {
      throw new BadRequestException(`Film with id ${dto.filmId} not found`);
    }
    if (!this.hallsService.findById(dto.hallId)) {
      throw new BadRequestException(`Hall with id ${dto.hallId} not found`);
    }

    const startsAtMs = Date.parse(dto.startsAt);
    if (Number.isNaN(startsAtMs)) {
      throw new BadRequestException(
        'startsAt is not a valid ISO 8601 date and time',
      );
    }
    if (startsAtMs <= Date.now()) {
      throw new BadRequestException('startsAt must not be in the past');
    }

    const showing: Showing = {
      id: randomUUID(),
      filmId: dto.filmId,
      hallId: dto.hallId,
      startsAt: dto.startsAt,
      price: dto.price,
    };
    this.showings.push(showing);
    return showing;
  }

  findAll(query: QueryShowingsDto): ShowingView[] {
    const { filmId, date } = query;

    return this.showings
      .filter((showing) => filmId === undefined || showing.filmId === filmId)
      .filter(
        (showing) =>
          date === undefined ||
          new Date(showing.startsAt).toISOString().slice(0, 10) === date,
      )
      .sort(
        (a, b) =>
          Date.parse(a.startsAt) - Date.parse(b.startsAt) ||
          (a.id < b.id ? -1 : a.id > b.id ? 1 : 0),
      )
      .map((showing) => this.toView(showing));
  }

  findOne(id: string): ShowingView {
    return this.toView(this.findEntity(id));
  }

  /** The stored showing (with filmId and hallId), for other modules. Throws 404. */
  findEntity(id: string): Showing {
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

  private toView(showing: Showing): ShowingView {
    return {
      id: showing.id,
      filmTitle: this.filmsService.findOne(showing.filmId).title,
      hallName: this.hallsService.findOne(showing.hallId).name,
      startsAt: showing.startsAt,
      price: showing.price,
    };
  }
}

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateHallDto } from './dto/create-hall.dto';
import { Hall, HallWithSeats } from './entities/hall.entity';
import { Seat } from './entities/seat.entity';

@Injectable()
export class HallsService {
  private readonly halls: Hall[] = [];

  /**
   * Checks that block deletion. A module that references halls (showings)
   * registers one here, so HallsService does not depend on it and the module
   * graph stays acyclic. A guard returns true while the hall is still in use.
   */
  private readonly deletionGuards: Array<(hallId: string) => boolean> = [];

  registerDeletionGuard(isInUse: (hallId: string) => boolean): void {
    this.deletionGuards.push(isInUse);
  }

  create(dto: CreateHallDto): Hall {
    if (this.halls.some(
        (hall) => hall.name.toLowerCase() === dto.name.toLowerCase(),
      )) {
      throw new ConflictException(
        `Hall with name "${dto.name}" already exists`,
      );
    }
    const hall: Hall = {
      id: randomUUID(),
      name: dto.name,
      rows: dto.rows,
      seatsPerRow: dto.seatsPerRow,
    };
    this.halls.push(hall);
    return hall;
  }

  findAll(): Hall[] {
    return [...this.halls];
  }

  /** Lookup for other modules that need "missing" as a value, not as an error. */
  findById(id: string): Hall | undefined {
    return this.halls.find((hall) => hall.id === id);
  }

  findOne(id: string): Hall {
    const hall = this.findById(id);
    if (!hall) {
      throw new NotFoundException(`Hall with id ${id} not found`);
    }
    return hall;
  }

  findOneWithSeats(id: string): HallWithSeats {
    const hall = this.findOne(id);
    return { ...hall, seats: this.buildSeats(hall) };
  }

  /** Seat layout of a hall: row 1..rows, seat 1..seatsPerRow, in that order. */
  buildSeats(hall: Hall): Seat[] {
    const seats: Seat[] = [];
    for (let row = 1; row <= hall.rows; row++) {
      for (let seat = 1; seat <= hall.seatsPerRow; seat++) {
        seats.push({ row, seat });
      }
    }
    return seats;
  }

  remove(id: string): void {
    const hall = this.findOne(id);
    if (this.deletionGuards.some((isInUse) => isInUse(id))) {
      throw new ConflictException(
        `Hall ${id} cannot be deleted: at least one showing references it`,
      );
    }
    this.halls.splice(this.halls.indexOf(hall), 1);
  }
}

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateHallDto } from './dto/create-hall.dto';

export interface Hall {
  id: string;
  name: string;
  rows: number;
  seatsPerRow: number;
}

export interface Seat {
  row: number;
  seat: number;
}

@Injectable()
export class HallsService {
  private readonly halls: Hall[] = [];

  create(dto: CreateHallDto): Hall {
    const normalizedName = dto.name.trim();

    if (
      this.halls.some(
        (hall) => hall.name.toLowerCase() === normalizedName.toLowerCase(),
      )
    ) {
      throw new ConflictException(
        `Зал з назвою "${normalizedName}" вже існує`,
      );
    }

    const hall: Hall = {
      id: randomUUID(),
      name: normalizedName,
      rows: dto.rows,
      seatsPerRow: dto.seatsPerRow,
    };

    this.halls.push(hall);
    return hall;
  }

  findAll(): Hall[] {
    return [...this.halls];
  }

  findOne(id: string): Hall & { seats: Seat[] } {
    const hall = this.halls.find((item) => item.id === id);

    if (!hall) {
      throw new NotFoundException(`Зал з id "${id}" не знайдено`);
    }

    const seats: Seat[] = [];

    for (let row = 1; row <= hall.rows; row++) {
      for (let seat = 1; seat <= hall.seatsPerRow; seat++) {
        seats.push({ row, seat });
      }
    }

    return { ...hall, seats };
  }

  getHall(id: string): Hall {
    const hall = this.halls.find((item) => item.id === id);

    if (!hall) {
      throw new NotFoundException(`Зал з id "${id}" не знайдено`);
    }

    return hall;
  }

  remove(id: string, hasShowings: boolean): void {
    this.getHall(id);

    if (hasShowings) {
      throw new ConflictException(
        `Неможливо видалити зал "${id}", оскільки на нього є сеанси`,
      );
    }

    const index = this.halls.findIndex((hall) => hall.id === id);
    this.halls.splice(index, 1);
  }
}

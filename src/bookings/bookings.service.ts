import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { HallsService } from '../halls/halls.service';
import { ShowingsService } from '../showings/showings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking, SeatAvailability } from './entities/booking.entity';

const seatKey = (seat: { row: number; seat: number }): string =>
  `${seat.row}:${seat.seat}`;

@Injectable()
export class BookingsService {
  private readonly bookings: Booking[] = [];

  constructor(
    private readonly showingsService: ShowingsService,
    private readonly hallsService: HallsService,
  ) {}

  create(showingId: string, dto: CreateBookingDto): Booking {
    const showing = this.showingsService.findEntity(showingId);
    const hall = this.hallsService.findOne(showing.hallId);

    // 1. Layout of the hall: every seat must exist.
    for (const { row, seat } of dto.seats) {
      if (row > hall.rows || seat > hall.seatsPerRow) {
        throw new BadRequestException(
          `Seat (row ${row}, seat ${seat}) does not exist in hall "${hall.name}": ${hall.rows} rows, ${hall.seatsPerRow} seats per row`,
        );
      }
    }

    // 2. State of the showing: no seat may be taken already. Both checks run
    //    before anything is stored, so a rejected request books nothing.
    const taken = this.bookedKeys(showingId);
    const alreadyBooked = dto.seats.filter((seat) => taken.has(seatKey(seat)));
    if (alreadyBooked.length > 0) {
      const list = alreadyBooked
        .map((seat) => `(row ${seat.row}, seat ${seat.seat})`)
        .join(', ');
      throw new ConflictException(
        `Seats already booked on this showing: ${list}`,
      );
    }

    const booking: Booking = {
      id: randomUUID(),
      showingId,
      seats: dto.seats.map(({ row, seat }) => ({ row, seat })),
      totalPrice: showing.price * dto.seats.length,
    };
    this.bookings.push(booking);
    return booking;
  }

  findAll(): Booking[] {
    return [...this.bookings];
  }

  findByShowing(showingId: string): Booking[] {
    this.showingsService.findEntity(showingId); // 404 if the showing is unknown
    return this.bookings.filter((booking) => booking.showingId === showingId);
  }

  /** Seat map of a showing: the layout of its hall plus who holds what. */
  getSeatMap(showingId: string): SeatAvailability[] {
    const showing = this.showingsService.findEntity(showingId);
    const hall = this.hallsService.findOne(showing.hallId);
    const taken = this.bookedKeys(showingId);
    return this.hallsService.buildSeats(hall).map((seat) => ({
      row: seat.row,
      seat: seat.seat,
      isBooked: taken.has(seatKey(seat)),
    }));
  }

  remove(id: string): void {
    const index = this.bookings.findIndex((booking) => booking.id === id);
    if (index === -1) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }
    this.bookings.splice(index, 1);
  }

  private bookedKeys(showingId: string): Set<string> {
    const keys = new Set<string>();
    for (const booking of this.bookings) {
      if (booking.showingId !== showingId) continue;
      for (const seat of booking.seats) keys.add(seatKey(seat));
    }
    return keys;
  }
}

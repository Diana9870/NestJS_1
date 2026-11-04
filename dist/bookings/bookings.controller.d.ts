import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking, SeatAvailability } from './entities/booking.entity';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    findAll(): Booking[];
    create(showingId: string, dto: CreateBookingDto): Booking;
    findByShowing(showingId: string): Booking[];
    getSeats(showingId: string): SeatAvailability[];
    remove(id: string): void;
}

import { HallsService } from '../halls/halls.service';
import { ShowingsService } from '../showings/showings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking, SeatAvailability } from './entities/booking.entity';
export declare class BookingsService {
    private readonly showingsService;
    private readonly hallsService;
    private readonly bookings;
    constructor(showingsService: ShowingsService, hallsService: HallsService);
    create(showingId: string, dto: CreateBookingDto): Booking;
    findAll(): Booking[];
    findByShowing(showingId: string): Booking[];
    getSeatMap(showingId: string): SeatAvailability[];
    remove(id: string): void;
    private bookedKeys;
}

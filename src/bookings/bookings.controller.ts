import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { parseIdPipe } from '../common/pipes/parse-id.pipe';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking, SeatAvailability } from './entities/booking.entity';

/**
 * No path prefix on purpose: bookings own routes under both /bookings and
 * /showings/:id. The seat map lives here (and not in ShowingsController)
 * because it is computed from bookings, and ShowingsModule must not depend
 * on BookingsModule, which already depends on it.
 */
@Controller()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('bookings')
  @ApiTags('bookings')
  @ApiOperation({ summary: 'List all bookings of the service' })
  @ApiOkResponse({ description: 'Bookings, empty array if there are none', type: [Booking] })
  findAll(): Booking[] {
    return this.bookingsService.findAll();
  }

  @Post('showings/:id/bookings')
  @ApiTags('bookings')
  @ApiOperation({
    summary: 'Book seats on a showing',
    description:
      'All-or-nothing: if any seat is invalid or already taken, no seat of the request is booked.',
  })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Showing id' })
  @ApiCreatedResponse({
    description: 'Booking created; totalPrice = showing price x number of seats',
    type: Booking,
  })
  @ApiBadRequestResponse({
    description:
      'seats is empty, an item lacks row or seat, a seat is repeated, a number is not a positive integer, or a seat is outside the hall',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({ description: 'No showing with this id', type: ErrorResponseDto })
  @ApiConflictResponse({
    description: 'At least one requested seat is already booked on this showing',
    type: ErrorResponseDto,
  })
  create(
    @Param('id', parseIdPipe) showingId: string,
    @Body() dto: CreateBookingDto,
  ): Booking {
    return this.bookingsService.create(showingId, dto);
  }

  @Get('showings/:id/bookings')
  @ApiTags('bookings')
  @ApiOperation({ summary: 'List bookings of one showing' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Showing id' })
  @ApiOkResponse({ description: 'Bookings of the showing', type: [Booking] })
  @ApiNotFoundResponse({ description: 'No showing with this id', type: ErrorResponseDto })
  findByShowing(@Param('id', parseIdPipe) showingId: string): Booking[] {
    return this.bookingsService.findByShowing(showingId);
  }

  @Get('showings/:id/seats')
  @ApiTags('showings')
  @ApiOperation({ summary: 'Seat map of a showing with free and booked seats' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Showing id' })
  @ApiOkResponse({
    description: 'Every seat of the hall (rows x seatsPerRow items) with isBooked',
    type: [SeatAvailability],
  })
  @ApiNotFoundResponse({ description: 'No showing with this id', type: ErrorResponseDto })
  getSeats(@Param('id', parseIdPipe) showingId: string): SeatAvailability[] {
    return this.bookingsService.getSeatMap(showingId);
  }

  @Delete('bookings/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiTags('bookings')
  @ApiOperation({ summary: 'Cancel a booking; its seats become free again' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Booking id' })
  @ApiNoContentResponse({ description: 'Booking cancelled' })
  @ApiNotFoundResponse({ description: 'No booking with this id', type: ErrorResponseDto })
  remove(@Param('id', parseIdPipe) id: string): void {
    this.bookingsService.remove(id);
  }
}

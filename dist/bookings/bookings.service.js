"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const halls_service_1 = require("../halls/halls.service");
const showings_service_1 = require("../showings/showings.service");
const seatKey = (seat) => `${seat.row}:${seat.seat}`;
let BookingsService = class BookingsService {
    showingsService;
    hallsService;
    bookings = [];
    constructor(showingsService, hallsService) {
        this.showingsService = showingsService;
        this.hallsService = hallsService;
    }
    create(showingId, dto) {
        const showing = this.showingsService.findEntity(showingId);
        const hall = this.hallsService.findOne(showing.hallId);
        for (const { row, seat } of dto.seats) {
            if (row > hall.rows || seat > hall.seatsPerRow) {
                throw new common_1.BadRequestException(`Seat (row ${row}, seat ${seat}) does not exist in hall "${hall.name}": ${hall.rows} rows, ${hall.seatsPerRow} seats per row`);
            }
        }
        const taken = this.bookedKeys(showingId);
        const alreadyBooked = dto.seats.filter((seat) => taken.has(seatKey(seat)));
        if (alreadyBooked.length > 0) {
            const list = alreadyBooked
                .map((seat) => `(row ${seat.row}, seat ${seat.seat})`)
                .join(', ');
            throw new common_1.ConflictException(`Seats already booked on this showing: ${list}`);
        }
        const booking = {
            id: (0, node_crypto_1.randomUUID)(),
            showingId,
            seats: dto.seats.map(({ row, seat }) => ({ row, seat })),
            totalPrice: showing.price * dto.seats.length,
        };
        this.bookings.push(booking);
        return booking;
    }
    findAll() {
        return [...this.bookings];
    }
    findByShowing(showingId) {
        this.showingsService.findEntity(showingId);
        return this.bookings.filter((booking) => booking.showingId === showingId);
    }
    getSeatMap(showingId) {
        const showing = this.showingsService.findEntity(showingId);
        const hall = this.hallsService.findOne(showing.hallId);
        const taken = this.bookedKeys(showingId);
        return this.hallsService.buildSeats(hall).map((seat) => ({
            row: seat.row,
            seat: seat.seat,
            isBooked: taken.has(seatKey(seat)),
        }));
    }
    remove(id) {
        const index = this.bookings.findIndex((booking) => booking.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Booking with id ${id} not found`);
        }
        this.bookings.splice(index, 1);
    }
    bookedKeys(showingId) {
        const keys = new Set();
        for (const booking of this.bookings) {
            if (booking.showingId !== showingId)
                continue;
            for (const seat of booking.seats)
                keys.add(seatKey(seat));
        }
        return keys;
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [showings_service_1.ShowingsService,
        halls_service_1.HallsService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map
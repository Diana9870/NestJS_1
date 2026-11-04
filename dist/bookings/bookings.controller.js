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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const error_response_dto_1 = require("../common/dto/error-response.dto");
const parse_id_pipe_1 = require("../common/pipes/parse-id.pipe");
const bookings_service_1 = require("./bookings.service");
const create_booking_dto_1 = require("./dto/create-booking.dto");
const booking_entity_1 = require("./entities/booking.entity");
let BookingsController = class BookingsController {
    bookingsService;
    constructor(bookingsService) {
        this.bookingsService = bookingsService;
    }
    findAll() {
        return this.bookingsService.findAll();
    }
    create(showingId, dto) {
        return this.bookingsService.create(showingId, dto);
    }
    findByShowing(showingId) {
        return this.bookingsService.findByShowing(showingId);
    }
    getSeats(showingId) {
        return this.bookingsService.getSeatMap(showingId);
    }
    remove(id) {
        this.bookingsService.remove(id);
    }
};
exports.BookingsController = BookingsController;
__decorate([
    (0, common_1.Get)('bookings'),
    (0, swagger_1.ApiTags)('bookings'),
    (0, swagger_1.ApiOperation)({ summary: 'List all bookings of the service' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Bookings, empty array if there are none', type: [booking_entity_1.Booking] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], BookingsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('showings/:id/bookings'),
    (0, swagger_1.ApiTags)('bookings'),
    (0, swagger_1.ApiOperation)({
        summary: 'Book seats on a showing',
        description: 'All-or-nothing: if any seat is invalid or already taken, no seat of the request is booked.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', format: 'uuid', description: 'Showing id' }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Booking created; totalPrice = showing price x number of seats',
        type: booking_entity_1.Booking,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'seats is empty, an item lacks row or seat, a seat is repeated, a number is not a positive integer, or a seat is outside the hall',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'No showing with this id', type: error_response_dto_1.ErrorResponseDto }),
    (0, swagger_1.ApiConflictResponse)({
        description: 'At least one requested seat is already booked on this showing',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('id', parse_id_pipe_1.parseIdPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_booking_dto_1.CreateBookingDto]),
    __metadata("design:returntype", booking_entity_1.Booking)
], BookingsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('showings/:id/bookings'),
    (0, swagger_1.ApiTags)('bookings'),
    (0, swagger_1.ApiOperation)({ summary: 'List bookings of one showing' }),
    (0, swagger_1.ApiParam)({ name: 'id', format: 'uuid', description: 'Showing id' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Bookings of the showing', type: [booking_entity_1.Booking] }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'No showing with this id', type: error_response_dto_1.ErrorResponseDto }),
    __param(0, (0, common_1.Param)('id', parse_id_pipe_1.parseIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Array)
], BookingsController.prototype, "findByShowing", null);
__decorate([
    (0, common_1.Get)('showings/:id/seats'),
    (0, swagger_1.ApiTags)('showings'),
    (0, swagger_1.ApiOperation)({ summary: 'Seat map of a showing with free and booked seats' }),
    (0, swagger_1.ApiParam)({ name: 'id', format: 'uuid', description: 'Showing id' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Every seat of the hall (rows x seatsPerRow items) with isBooked',
        type: [booking_entity_1.SeatAvailability],
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'No showing with this id', type: error_response_dto_1.ErrorResponseDto }),
    __param(0, (0, common_1.Param)('id', parse_id_pipe_1.parseIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Array)
], BookingsController.prototype, "getSeats", null);
__decorate([
    (0, common_1.Delete)('bookings/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiTags)('bookings'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel a booking; its seats become free again' }),
    (0, swagger_1.ApiParam)({ name: 'id', format: 'uuid', description: 'Booking id' }),
    (0, swagger_1.ApiNoContentResponse)({ description: 'Booking cancelled' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'No booking with this id', type: error_response_dto_1.ErrorResponseDto }),
    __param(0, (0, common_1.Param)('id', parse_id_pipe_1.parseIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "remove", null);
exports.BookingsController = BookingsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [bookings_service_1.BookingsService])
], BookingsController);
//# sourceMappingURL=bookings.controller.js.map
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
exports.HallsService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const showings_service_1 = require("../showings/showings.service");
let HallsService = class HallsService {
    showingsService;
    halls = [];
    constructor(showingsService) {
        this.showingsService = showingsService;
    }
    create(dto) {
        if (this.halls.some((hall) => hall.name === dto.name)) {
            throw new common_1.ConflictException(`Hall with name "${dto.name}" already exists`);
        }
        const hall = {
            id: (0, node_crypto_1.randomUUID)(),
            name: dto.name,
            rows: dto.rows,
            seatsPerRow: dto.seatsPerRow,
        };
        this.halls.push(hall);
        return hall;
    }
    findAll() {
        return [...this.halls];
    }
    findById(id) {
        return this.halls.find((hall) => hall.id === id);
    }
    findOne(id) {
        const hall = this.findById(id);
        if (!hall) {
            throw new common_1.NotFoundException(`Hall with id ${id} not found`);
        }
        return hall;
    }
    findOneWithSeats(id) {
        const hall = this.findOne(id);
        return { ...hall, seats: this.buildSeats(hall) };
    }
    buildSeats(hall) {
        const seats = [];
        for (let row = 1; row <= hall.rows; row++) {
            for (let seat = 1; seat <= hall.seatsPerRow; seat++) {
                seats.push({ row, seat });
            }
        }
        return seats;
    }
    remove(id) {
        const hall = this.findOne(id);
        if (this.showingsService.existsForHall(id)) {
            throw new common_1.ConflictException(`Hall ${id} cannot be deleted: at least one showing references it`);
        }
        this.halls.splice(this.halls.indexOf(hall), 1);
    }
};
exports.HallsService = HallsService;
exports.HallsService = HallsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => showings_service_1.ShowingsService))),
    __metadata("design:paramtypes", [showings_service_1.ShowingsService])
], HallsService);
//# sourceMappingURL=halls.service.js.map
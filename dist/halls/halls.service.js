"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HallsService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
let HallsService = class HallsService {
    halls = [];
    create(dto) {
        const normalizedName = dto.name.trim();
        if (this.halls.some((hall) => hall.name.toLowerCase() === normalizedName.toLowerCase())) {
            throw new common_1.ConflictException(`Зал з назвою "${normalizedName}" вже існує`);
        }
        const hall = {
            id: (0, node_crypto_1.randomUUID)(),
            name: normalizedName,
            rows: dto.rows,
            seatsPerRow: dto.seatsPerRow,
        };
        this.halls.push(hall);
        return hall;
    }
    findAll() {
        return [...this.halls];
    }
    findOne(id) {
        const hall = this.halls.find((item) => item.id === id);
        if (!hall) {
            throw new common_1.NotFoundException(`Зал з id "${id}" не знайдено`);
        }
        const seats = [];
        for (let row = 1; row <= hall.rows; row++) {
            for (let seat = 1; seat <= hall.seatsPerRow; seat++) {
                seats.push({ row, seat });
            }
        }
        return { ...hall, seats };
    }
    getHall(id) {
        const hall = this.halls.find((item) => item.id === id);
        if (!hall) {
            throw new common_1.NotFoundException(`Зал з id "${id}" не знайдено`);
        }
        return hall;
    }
    remove(id, hasShowings) {
        this.getHall(id);
        if (hasShowings) {
            throw new common_1.ConflictException(`Неможливо видалити зал "${id}", оскільки на нього є сеанси`);
        }
        const index = this.halls.findIndex((hall) => hall.id === id);
        this.halls.splice(index, 1);
    }
};
exports.HallsService = HallsService;
exports.HallsService = HallsService = __decorate([
    (0, common_1.Injectable)()
], HallsService);
//# sourceMappingURL=halls.service.js.map
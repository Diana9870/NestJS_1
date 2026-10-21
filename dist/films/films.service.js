"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilmsService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
let FilmsService = class FilmsService {
    films = [];
    create(dto) {
        const film = {
            id: (0, node_crypto_1.randomUUID)(),
            title: dto.title,
            durationMinutes: dto.durationMinutes,
            releaseYear: dto.releaseYear,
        };
        this.films.push(film);
        return film;
    }
    findAll() {
        return [...this.films];
    }
    findOne(id) {
        const film = this.films.find((item) => item.id === id);
        if (!film) {
            throw new common_1.NotFoundException(`Фільм з id "${id}" не знайдено`);
        }
        return film;
    }
    update(id, dto) {
        const film = this.findOne(id);
        Object.assign(film, dto);
        return film;
    }
    remove(id) {
        this.findOne(id);
        const index = this.films.findIndex((film) => film.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Фільм з id "${id}" не знайдено`);
        }
        this.films.splice(index, 1);
    }
    ensureCanDelete(id, hasShowings) {
        this.findOne(id);
        if (hasShowings) {
            throw new common_1.ConflictException(`Неможливо видалити фільм "${id}", оскільки на нього є сеанси`);
        }
    }
};
exports.FilmsService = FilmsService;
exports.FilmsService = FilmsService = __decorate([
    (0, common_1.Injectable)()
], FilmsService);
//# sourceMappingURL=films.service.js.map
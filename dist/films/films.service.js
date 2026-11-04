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
exports.FilmsService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const showings_service_1 = require("../showings/showings.service");
let FilmsService = class FilmsService {
    showingsService;
    films = [];
    constructor(showingsService) {
        this.showingsService = showingsService;
    }
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
    findById(id) {
        return this.films.find((film) => film.id === id);
    }
    findOne(id) {
        const film = this.findById(id);
        if (!film) {
            throw new common_1.NotFoundException(`Film with id ${id} not found`);
        }
        return film;
    }
    update(id, dto) {
        const film = this.findOne(id);
        if (dto.title !== undefined)
            film.title = dto.title;
        if (dto.durationMinutes !== undefined) {
            film.durationMinutes = dto.durationMinutes;
        }
        if (dto.releaseYear !== undefined)
            film.releaseYear = dto.releaseYear;
        return film;
    }
    remove(id) {
        const film = this.findOne(id);
        if (this.showingsService.existsForFilm(id)) {
            throw new common_1.ConflictException(`Film ${id} cannot be deleted: at least one showing references it`);
        }
        this.films.splice(this.films.indexOf(film), 1);
    }
};
exports.FilmsService = FilmsService;
exports.FilmsService = FilmsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => showings_service_1.ShowingsService))),
    __metadata("design:paramtypes", [showings_service_1.ShowingsService])
], FilmsService);
//# sourceMappingURL=films.service.js.map
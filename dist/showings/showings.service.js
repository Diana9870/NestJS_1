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
exports.ShowingsService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const films_service_1 = require("../films/films.service");
const halls_service_1 = require("../halls/halls.service");
let ShowingsService = class ShowingsService {
    filmsService;
    hallsService;
    showings = [];
    constructor(filmsService, hallsService) {
        this.filmsService = filmsService;
        this.hallsService = hallsService;
    }
    create(dto) {
        this.filmsService.findOne(dto.filmId);
        this.hallsService.getHall(dto.hallId);
        const startsAtDate = new Date(dto.startsAt);
        if (Number.isNaN(startsAtDate.getTime())) {
            throw new common_1.ConflictException('Некоректна дата початку сеансу');
        }
        const showing = {
            id: (0, node_crypto_1.randomUUID)(),
            filmId: dto.filmId,
            hallId: dto.hallId,
            startsAt: startsAtDate.toISOString(),
        };
        this.showings.push(showing);
        return showing;
    }
    findAll() {
        return [...this.showings];
    }
    findOne(id) {
        const showing = this.showings.find((item) => item.id === id);
        if (!showing) {
            throw new common_1.NotFoundException(`Сеанс з id "${id}" не знайдено`);
        }
        return showing;
    }
    findByFilmId(filmId) {
        return this.showings.filter((item) => item.filmId === filmId);
    }
    findByHallId(hallId) {
        return this.showings.filter((item) => item.hallId === hallId);
    }
    hasShowingsForFilm(filmId) {
        return this.showings.some((item) => item.filmId === filmId);
    }
    hasShowingsForHall(hallId) {
        return this.showings.some((item) => item.hallId === hallId);
    }
    remove(id) {
        this.findOne(id);
        const index = this.showings.findIndex((item) => item.id === id);
        this.showings.splice(index, 1);
    }
};
exports.ShowingsService = ShowingsService;
exports.ShowingsService = ShowingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [films_service_1.FilmsService,
        halls_service_1.HallsService])
], ShowingsService);
//# sourceMappingURL=showings.service.js.map
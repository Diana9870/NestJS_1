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
        if (!this.filmsService.findById(dto.filmId)) {
            throw new common_1.BadRequestException(`Film with id ${dto.filmId} not found`);
        }
        if (!this.hallsService.findById(dto.hallId)) {
            throw new common_1.BadRequestException(`Hall with id ${dto.hallId} not found`);
        }
        const startsAtMs = Date.parse(dto.startsAt);
        if (Number.isNaN(startsAtMs)) {
            throw new common_1.BadRequestException('startsAt is not a valid ISO 8601 date and time');
        }
        if (startsAtMs <= Date.now()) {
            throw new common_1.BadRequestException('startsAt must not be in the past');
        }
        const showing = {
            id: (0, node_crypto_1.randomUUID)(),
            filmId: dto.filmId,
            hallId: dto.hallId,
            startsAt: dto.startsAt,
            price: dto.price,
        };
        this.showings.push(showing);
        return showing;
    }
    findAll(query) {
        const { filmId, date } = query;
        return this.showings
            .filter((showing) => filmId === undefined || showing.filmId === filmId)
            .filter((showing) => date === undefined ||
            new Date(showing.startsAt).toISOString().slice(0, 10) === date)
            .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt) ||
            (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
            .map((showing) => this.toView(showing));
    }
    findOne(id) {
        return this.toView(this.findEntity(id));
    }
    findEntity(id) {
        const showing = this.showings.find((item) => item.id === id);
        if (!showing) {
            throw new common_1.NotFoundException(`Showing with id ${id} not found`);
        }
        return showing;
    }
    existsForFilm(filmId) {
        return this.showings.some((showing) => showing.filmId === filmId);
    }
    existsForHall(hallId) {
        return this.showings.some((showing) => showing.hallId === hallId);
    }
    toView(showing) {
        return {
            id: showing.id,
            filmTitle: this.filmsService.findOne(showing.filmId).title,
            hallName: this.hallsService.findOne(showing.hallId).name,
            startsAt: showing.startsAt,
            price: showing.price,
        };
    }
};
exports.ShowingsService = ShowingsService;
exports.ShowingsService = ShowingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => films_service_1.FilmsService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => halls_service_1.HallsService))),
    __metadata("design:paramtypes", [films_service_1.FilmsService,
        halls_service_1.HallsService])
], ShowingsService);
//# sourceMappingURL=showings.service.js.map
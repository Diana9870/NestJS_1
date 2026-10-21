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
exports.FilmsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_film_dto_1 = require("./dto/create-film.dto");
const update_film_dto_1 = require("./dto/update-film.dto");
const films_service_1 = require("./films.service");
let FilmsController = class FilmsController {
    filmsService;
    constructor(filmsService) {
        this.filmsService = filmsService;
    }
    create(dto) {
        return this.filmsService.create(dto);
    }
    findAll() {
        return this.filmsService.findAll();
    }
    findOne(id) {
        return this.filmsService.findOne(id);
    }
    update(id, dto) {
        return this.filmsService.update(id, dto);
    }
    remove(id) {
        this.filmsService.remove(id);
    }
};
exports.FilmsController = FilmsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Створити фільм' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Фільм створено' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_film_dto_1.CreateFilmDto]),
    __metadata("design:returntype", Object)
], FilmsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Отримати всі фільми' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Список фільмів' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], FilmsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Отримати фільм за ID' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Фільм знайдено' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Фільм не знайдено' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], FilmsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Оновити фільм' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Фільм оновлено' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Фільм не знайдено' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_film_dto_1.UpdateFilmDto]),
    __metadata("design:returntype", Object)
], FilmsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Видалити фільм' }),
    (0, swagger_1.ApiNoContentResponse)({ description: 'Фільм видалено' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Фільм не знайдено' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FilmsController.prototype, "remove", null);
exports.FilmsController = FilmsController = __decorate([
    (0, swagger_1.ApiTags)('Films'),
    (0, common_1.Controller)('films'),
    __metadata("design:paramtypes", [films_service_1.FilmsService])
], FilmsController);
//# sourceMappingURL=films.controller.js.map
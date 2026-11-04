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
exports.HallsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const error_response_dto_1 = require("../common/dto/error-response.dto");
const parse_id_pipe_1 = require("../common/pipes/parse-id.pipe");
const create_hall_dto_1 = require("./dto/create-hall.dto");
const hall_entity_1 = require("./entities/hall.entity");
const halls_service_1 = require("./halls.service");
let HallsController = class HallsController {
    hallsService;
    constructor(hallsService) {
        this.hallsService = hallsService;
    }
    create(dto) {
        return this.hallsService.create(dto);
    }
    findAll() {
        return this.hallsService.findAll();
    }
    findOne(id) {
        return this.hallsService.findOneWithSeats(id);
    }
    remove(id) {
        this.hallsService.remove(id);
    }
};
exports.HallsController = HallsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a hall' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Hall created', type: hall_entity_1.Hall }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'A field is missing, has a wrong type, or a number is not a positive integer',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiConflictResponse)({
        description: 'A hall with this name already exists',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_hall_dto_1.CreateHallDto]),
    __metadata("design:returntype", hall_entity_1.Hall)
], HallsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all halls' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Halls, empty array if there are none', type: [hall_entity_1.Hall] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], HallsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get one hall together with its seats' }),
    (0, swagger_1.ApiParam)({ name: 'id', format: 'uuid' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'The hall with the `seats` array (rows x seatsPerRow items)',
        type: hall_entity_1.HallWithSeats,
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'No hall with this id', type: error_response_dto_1.ErrorResponseDto }),
    __param(0, (0, common_1.Param)('id', parse_id_pipe_1.parseIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", hall_entity_1.HallWithSeats)
], HallsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a hall' }),
    (0, swagger_1.ApiParam)({ name: 'id', format: 'uuid' }),
    (0, swagger_1.ApiNoContentResponse)({ description: 'Hall deleted' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'No hall with this id', type: error_response_dto_1.ErrorResponseDto }),
    (0, swagger_1.ApiConflictResponse)({
        description: 'At least one showing references the hall',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('id', parse_id_pipe_1.parseIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HallsController.prototype, "remove", null);
exports.HallsController = HallsController = __decorate([
    (0, swagger_1.ApiTags)('halls'),
    (0, common_1.Controller)('halls'),
    __metadata("design:paramtypes", [halls_service_1.HallsService])
], HallsController);
//# sourceMappingURL=halls.controller.js.map
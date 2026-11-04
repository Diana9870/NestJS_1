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
exports.ShowingsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const error_response_dto_1 = require("../common/dto/error-response.dto");
const parse_id_pipe_1 = require("../common/pipes/parse-id.pipe");
const create_showing_dto_1 = require("./dto/create-showing.dto");
const query_showings_dto_1 = require("./dto/query-showings.dto");
const showing_entity_1 = require("./entities/showing.entity");
const showings_service_1 = require("./showings.service");
let ShowingsController = class ShowingsController {
    showingsService;
    constructor(showingsService) {
        this.showingsService = showingsService;
    }
    create(dto) {
        return this.showingsService.create(dto);
    }
    findAll(query) {
        return this.showingsService.findAll(query);
    }
    findOne(id) {
        return this.showingsService.findOne(id);
    }
};
exports.ShowingsController = ShowingsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Put a showing into the schedule' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Showing created', type: showing_entity_1.Showing }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'A field is missing or invalid, startsAt is not ISO 8601 or is in the past, price is not a positive integer, or the film / hall does not exist',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_showing_dto_1.CreateShowingDto]),
    __metadata("design:returntype", showing_entity_1.Showing)
], ShowingsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'List showings',
        description: 'Sorted by start time ascending, ties broken by id. Filters are combined with AND.',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Showings with film title and hall name instead of ids',
        type: [showing_entity_1.ShowingView],
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'date does not match YYYY-MM-DD',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_showings_dto_1.QueryShowingsDto]),
    __metadata("design:returntype", Array)
], ShowingsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get one showing' }),
    (0, swagger_1.ApiParam)({ name: 'id', format: 'uuid' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'The showing with film title and hall name',
        type: showing_entity_1.ShowingView,
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'No showing with this id', type: error_response_dto_1.ErrorResponseDto }),
    __param(0, (0, common_1.Param)('id', parse_id_pipe_1.parseIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", showing_entity_1.ShowingView)
], ShowingsController.prototype, "findOne", null);
exports.ShowingsController = ShowingsController = __decorate([
    (0, swagger_1.ApiTags)('showings'),
    (0, common_1.Controller)('showings'),
    __metadata("design:paramtypes", [showings_service_1.ShowingsService])
], ShowingsController);
//# sourceMappingURL=showings.controller.js.map
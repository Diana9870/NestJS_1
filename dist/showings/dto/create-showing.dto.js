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
exports.CreateShowingDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateShowingDto {
    filmId;
    hallId;
    startsAt;
    price;
}
exports.CreateShowingDto = CreateShowingDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Id of an existing film', format: 'uuid' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateShowingDto.prototype, "filmId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Id of an existing hall', format: 'uuid' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateShowingDto.prototype, "hallId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ISO 8601 date and time, must be in the future',
        example: '2099-01-01T18:00:00Z',
    }),
    (0, class_validator_1.IsISO8601)({ strict: true, strictSeparator: true }),
    __metadata("design:type", String)
], CreateShowingDto.prototype, "startsAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ticket price in kopiykas, a positive integer (12500 = 125 UAH)',
        example: 12500,
        minimum: 1,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateShowingDto.prototype, "price", void 0);
//# sourceMappingURL=create-showing.dto.js.map
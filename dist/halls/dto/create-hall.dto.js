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
exports.CreateHallDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const transforms_1 = require("../../common/transforms");
class CreateHallDto {
    name;
    rows;
    seatsPerRow;
}
exports.CreateHallDto = CreateHallDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Must be unique among all halls', example: 'Hall 1', maxLength: 100 }),
    (0, class_transformer_1.Transform)(transforms_1.trimString),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateHallDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of rows, a positive integer', example: 3, minimum: 1, maximum: 1000 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.Max)(1000),
    __metadata("design:type", Number)
], CreateHallDto.prototype, "rows", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Seats in every row, a positive integer',
        example: 5,
        minimum: 1,
        maximum: 1000,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.Max)(1000),
    __metadata("design:type", Number)
], CreateHallDto.prototype, "seatsPerRow", void 0);
//# sourceMappingURL=create-hall.dto.js.map
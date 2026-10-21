"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFilmDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_film_dto_1 = require("./create-film.dto");
class UpdateFilmDto extends (0, swagger_1.PartialType)(create_film_dto_1.CreateFilmDto) {
}
exports.UpdateFilmDto = UpdateFilmDto;
//# sourceMappingURL=update-film.dto.js.map
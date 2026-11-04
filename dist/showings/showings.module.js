"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShowingsModule = void 0;
const common_1 = require("@nestjs/common");
const films_module_1 = require("../films/films.module");
const halls_module_1 = require("../halls/halls.module");
const showings_controller_1 = require("./showings.controller");
const showings_service_1 = require("./showings.service");
let ShowingsModule = class ShowingsModule {
};
exports.ShowingsModule = ShowingsModule;
exports.ShowingsModule = ShowingsModule = __decorate([
    (0, common_1.Module)({
        imports: [(0, common_1.forwardRef)(() => films_module_1.FilmsModule), (0, common_1.forwardRef)(() => halls_module_1.HallsModule)],
        controllers: [showings_controller_1.ShowingsController],
        providers: [showings_service_1.ShowingsService],
        exports: [showings_service_1.ShowingsService],
    })
], ShowingsModule);
//# sourceMappingURL=showings.module.js.map
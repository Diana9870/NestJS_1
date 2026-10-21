import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { FilmsService } from './films.service';
import type { Film } from './films.service';
export declare class FilmsController {
    private readonly filmsService;
    constructor(filmsService: FilmsService);
    create(dto: CreateFilmDto): Film;
    findAll(): Film[];
    findOne(id: string): Film;
    update(id: string, dto: UpdateFilmDto): Film;
    remove(id: string): void;
}

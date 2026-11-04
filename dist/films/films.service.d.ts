import { ShowingsService } from '../showings/showings.service';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { Film } from './entities/film.entity';
export declare class FilmsService {
    private readonly showingsService;
    private readonly films;
    constructor(showingsService: ShowingsService);
    create(dto: CreateFilmDto): Film;
    findAll(): Film[];
    findById(id: string): Film | undefined;
    findOne(id: string): Film;
    update(id: string, dto: UpdateFilmDto): Film;
    remove(id: string): void;
}

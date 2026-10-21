import { UpdateFilmDto } from './dto/update-film.dto';
import { CreateFilmDto } from './dto/create-film.dto';
export interface Film {
    id: string;
    title: string;
    durationMinutes: number;
    releaseYear: number;
}
export declare class FilmsService {
    private readonly films;
    create(dto: CreateFilmDto): Film;
    findAll(): Film[];
    findOne(id: string): Film;
    update(id: string, dto: UpdateFilmDto): Film;
    remove(id: string): void;
    ensureCanDelete(id: string, hasShowings: boolean): void;
}

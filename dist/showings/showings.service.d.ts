import { FilmsService } from '../films/films.service';
import { HallsService } from '../halls/halls.service';
import { CreateShowingDto } from './dto/create-showing.dto';
export interface Showing {
    id: string;
    filmId: string;
    hallId: string;
    startsAt: string;
}
export declare class ShowingsService {
    private readonly filmsService;
    private readonly hallsService;
    private readonly showings;
    constructor(filmsService: FilmsService, hallsService: HallsService);
    create(dto: CreateShowingDto): Showing;
    findAll(): Showing[];
    findOne(id: string): Showing;
    findByFilmId(filmId: string): Showing[];
    findByHallId(hallId: string): Showing[];
    hasShowingsForFilm(filmId: string): boolean;
    hasShowingsForHall(hallId: string): boolean;
    remove(id: string): void;
}

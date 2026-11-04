import { FilmsService } from '../films/films.service';
import { HallsService } from '../halls/halls.service';
import { CreateShowingDto } from './dto/create-showing.dto';
import { QueryShowingsDto } from './dto/query-showings.dto';
import { Showing, ShowingView } from './entities/showing.entity';
export declare class ShowingsService {
    private readonly filmsService;
    private readonly hallsService;
    private readonly showings;
    constructor(filmsService: FilmsService, hallsService: HallsService);
    create(dto: CreateShowingDto): Showing;
    findAll(query: QueryShowingsDto): ShowingView[];
    findOne(id: string): ShowingView;
    findEntity(id: string): Showing;
    existsForFilm(filmId: string): boolean;
    existsForHall(hallId: string): boolean;
    private toView;
}

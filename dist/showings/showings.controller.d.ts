import { CreateShowingDto } from './dto/create-showing.dto';
import { QueryShowingsDto } from './dto/query-showings.dto';
import { Showing, ShowingView } from './entities/showing.entity';
import { ShowingsService } from './showings.service';
export declare class ShowingsController {
    private readonly showingsService;
    constructor(showingsService: ShowingsService);
    create(dto: CreateShowingDto): Showing;
    findAll(query: QueryShowingsDto): ShowingView[];
    findOne(id: string): ShowingView;
}

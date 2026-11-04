import { ShowingsService } from '../showings/showings.service';
import { CreateHallDto } from './dto/create-hall.dto';
import { Hall, HallWithSeats } from './entities/hall.entity';
import { Seat } from './entities/seat.entity';
export declare class HallsService {
    private readonly showingsService;
    private readonly halls;
    constructor(showingsService: ShowingsService);
    create(dto: CreateHallDto): Hall;
    findAll(): Hall[];
    findById(id: string): Hall | undefined;
    findOne(id: string): Hall;
    findOneWithSeats(id: string): HallWithSeats;
    buildSeats(hall: Hall): Seat[];
    remove(id: string): void;
}

import { CreateHallDto } from './dto/create-hall.dto';
import { Hall, HallWithSeats } from './entities/hall.entity';
import { HallsService } from './halls.service';
export declare class HallsController {
    private readonly hallsService;
    constructor(hallsService: HallsService);
    create(dto: CreateHallDto): Hall;
    findAll(): Hall[];
    findOne(id: string): HallWithSeats;
    remove(id: string): void;
}

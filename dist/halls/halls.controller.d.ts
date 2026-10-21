import { CreateHallDto } from './dto/create-hall.dto';
import { HallsService } from './halls.service';
import type { Hall, Seat } from './halls.service';
export declare class HallsController {
    private readonly hallsService;
    constructor(hallsService: HallsService);
    create(dto: CreateHallDto): Hall;
    findAll(): Hall[];
    findOne(id: string): Hall & {
        seats: Seat[];
    };
    remove(id: string): void;
}

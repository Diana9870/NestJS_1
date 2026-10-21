import { CreateHallDto } from './dto/create-hall.dto';
export interface Hall {
    id: string;
    name: string;
    rows: number;
    seatsPerRow: number;
}
export interface Seat {
    row: number;
    seat: number;
}
export declare class HallsService {
    private readonly halls;
    create(dto: CreateHallDto): Hall;
    findAll(): Hall[];
    findOne(id: string): Hall & {
        seats: Seat[];
    };
    getHall(id: string): Hall;
    remove(id: string, hasShowings: boolean): void;
}

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateHallDto } from './dto/create-hall.dto';
import { HallsService } from './halls.service';
import type { Hall, Seat } from './halls.service';

@ApiTags('Halls')
@Controller('halls')
export class HallsController {
  constructor(private readonly hallsService: HallsService) {}

  @Post()
  @ApiOperation({ summary: 'Створити зал' })
  @ApiCreatedResponse({ description: 'Зал створено' })
  create(@Body() dto: CreateHallDto): Hall {
    return this.hallsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Отримати всі зали' })
  @ApiOkResponse({ description: 'Список залів' })
  findAll(): Hall[] {
    return this.hallsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати зал зі схемою місць' })
  @ApiOkResponse({ description: 'Зал та перелік місць' })
  @ApiNotFoundResponse({ description: 'Зал не знайдено' })
  findOne(@Param('id') id: string): Hall & { seats: Seat[] } {
    return this.hallsService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Видалити зал' })
  @ApiNoContentResponse({ description: 'Зал видалено' })
  @ApiNotFoundResponse({ description: 'Зал не знайдено' })
  remove(@Param('id') id: string): void {
    this.hallsService.remove(id, false);
  }
}

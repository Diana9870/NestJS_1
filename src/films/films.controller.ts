import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
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
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { FilmsService } from './films.service';
import type { Film } from './films.service';

@ApiTags('Films')
@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Post()
  @ApiOperation({ summary: 'Створити фільм' })
  @ApiCreatedResponse({ description: 'Фільм створено' })
  create(@Body() dto: CreateFilmDto): Film {
    return this.filmsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Отримати всі фільми' })
  @ApiOkResponse({ description: 'Список фільмів' })
  findAll(): Film[] {
    return this.filmsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати фільм за ID' })
  @ApiOkResponse({ description: 'Фільм знайдено' })
  @ApiNotFoundResponse({ description: 'Фільм не знайдено' })
  findOne(@Param('id') id: string): Film {
    return this.filmsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити фільм' })
  @ApiOkResponse({ description: 'Фільм оновлено' })
  @ApiNotFoundResponse({ description: 'Фільм не знайдено' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateFilmDto,
  ): Film {
    return this.filmsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Видалити фільм' })
  @ApiNoContentResponse({ description: 'Фільм видалено' })
  @ApiNotFoundResponse({ description: 'Фільм не знайдено' })
  remove(@Param('id') id: string): void {
    this.filmsService.remove(id);
  }
}

import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { parseIdPipe } from '../common/pipes/parse-id.pipe';
import { CreateShowingDto } from './dto/create-showing.dto';
import { QueryShowingsDto } from './dto/query-showings.dto';
import { Showing, ShowingView } from './entities/showing.entity';
import { ShowingsService } from './showings.service';

@ApiTags('showings')
@Controller('showings')
export class ShowingsController {
  constructor(private readonly showingsService: ShowingsService) {}

  @Post()
  @ApiOperation({ summary: 'Put a showing into the schedule' })
  @ApiCreatedResponse({ description: 'Showing created', type: Showing })
  @ApiBadRequestResponse({
    description:
      'A field is missing or invalid, startsAt is not ISO 8601 or is in the past, price is not a positive integer, or the film / hall does not exist',
    type: ErrorResponseDto,
  })
  create(@Body() dto: CreateShowingDto): Showing {
    return this.showingsService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List showings',
    description:
      'Sorted by start time ascending, ties broken by id. Filters are combined with AND.',
  })
  @ApiOkResponse({
    description: 'Showings with film title and hall name instead of ids',
    type: [ShowingView],
  })
  @ApiBadRequestResponse({
    description: 'date does not match YYYY-MM-DD',
    type: ErrorResponseDto,
  })
  findAll(@Query() query: QueryShowingsDto): ShowingView[] {
    return this.showingsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one showing' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({
    description: 'The showing with film title and hall name',
    type: ShowingView,
  })
  @ApiNotFoundResponse({ description: 'No showing with this id', type: ErrorResponseDto })
  findOne(@Param('id', parseIdPipe) id: string): ShowingView {
    return this.showingsService.findOne(id);
  }
}

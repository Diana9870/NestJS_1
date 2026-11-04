import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsISO8601, IsPositive, IsUUID } from 'class-validator';

export class CreateShowingDto {
  @ApiProperty({ description: 'Id of an existing film', format: 'uuid' })
  @IsUUID()
  filmId: string;

  @ApiProperty({ description: 'Id of an existing hall', format: 'uuid' })
  @IsUUID()
  hallId: string;

  @ApiProperty({
    description: 'ISO 8601 date and time, must be in the future',
    example: '2099-01-01T18:00:00Z',
  })
  @IsISO8601({ strict: true, strictSeparator: true })
  startsAt: string;

  @ApiProperty({
    description: 'Ticket price in kopiykas, a positive integer (12500 = 125 UAH)',
    example: 12500,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  price: number;
}

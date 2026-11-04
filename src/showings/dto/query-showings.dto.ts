import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsISO8601, IsOptional, IsString, Matches } from 'class-validator';

export class QueryShowingsDto {
  @ApiPropertyOptional({
    description: 'Keep only the showings of this film',
    format: 'uuid',
  })
  @IsOptional()
  @IsString()
  filmId?: string;

  @ApiPropertyOptional({
    description: 'Keep only the showings that start on this day (YYYY-MM-DD, day boundaries are UTC)',
    example: '2099-01-01',
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date must be in YYYY-MM-DD format' })
  @IsISO8601(
    { strict: true },
    { message: 'date must be a valid calendar date in YYYY-MM-DD format' },
  )
  date?: string;
}

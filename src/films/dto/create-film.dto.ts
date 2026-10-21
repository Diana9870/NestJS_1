import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreateFilmDto {
  @ApiProperty({ example: 'Interstellar', description: 'Назва фільму' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  title: string;

  @ApiProperty({ example: 169, description: 'Тривалість у хвилинах' })
  @IsInt()
  @Min(1)
  durationMinutes: number;

  @ApiProperty({ example: 2014, description: 'Рік випуску' })
  @IsInt()
  @Min(1888)
  @Max(2100)
  releaseYear: number;
}

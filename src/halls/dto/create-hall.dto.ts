
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateHallDto {
  @ApiProperty({ example: 'Зал №1', description: 'Унікальна назва залу' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 3, description: 'Кількість рядів' })
  @IsInt()
  @Min(1)
  rows: number;

  @ApiProperty({ example: 5, description: 'Місць у кожному ряду' })
  @IsInt()
  @Min(1)
  seatsPerRow: number;
}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateShowingDto {
  @ApiProperty({ example: 'cc9e4f23-8a45-46e8-b292-75a398434472' })
  @IsUUID()
  filmId: string;

  @ApiProperty({ example: '63321086-5e3f-46b2-a17e-8391ae7effeb' })
  @IsUUID()
  hallId: string;

  @ApiProperty({ example: '2026-10-25T18:30:00.000Z' })
  @IsDateString()
  startsAt: string;
}

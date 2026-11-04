import { ApiProperty } from '@nestjs/swagger';

export class Film {
  @ApiProperty({ format: 'uuid', example: '7d1c0a9e-1b0b-4f43-9d34-0d9f0c6e3f11' })
  id: string;

  @ApiProperty({ example: 'Dune: Part Two' })
  title: string;

  @ApiProperty({ description: 'Duration in minutes', example: 166 })
  durationMinutes: number;

  @ApiProperty({ example: 2024 })
  releaseYear: number;
}

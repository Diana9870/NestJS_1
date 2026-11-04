import { ApiProperty } from '@nestjs/swagger';

/** A seat is identified by the pair (row, seat); there is no separate storage for it. */
export class Seat {
  @ApiProperty({ description: 'Row number, starting from 1', example: 2 })
  row: number;

  @ApiProperty({ description: 'Seat number in the row, starting from 1', example: 4 })
  seat: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { CheckInResponseDto } from './check-in.response.dto';

export class CheckInsWeekResponseDto {
  @ApiProperty({ example: '2026-01-20' })
  dateFrom!: string;

  @ApiProperty({ example: '2026-01-26' })
  dateTo!: string;

  @ApiProperty({ type: [CheckInResponseDto] })
  items!: CheckInResponseDto[];
}

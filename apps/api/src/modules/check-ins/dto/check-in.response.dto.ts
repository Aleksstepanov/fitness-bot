import { ApiProperty } from '@nestjs/swagger';
import { ECheckInStatus } from '../entities/check-in.entity';

export class CheckInResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty({ example: '2026-01-20' })
  checkInDate!: string;

  @ApiProperty({ enum: ECheckInStatus })
  status!: ECheckInStatus;

  @ApiProperty({ nullable: true })
  note!: string | null;

  @ApiProperty({ example: '2026-01-20T11:30:00.000Z' })
  createdAt!: string;
}

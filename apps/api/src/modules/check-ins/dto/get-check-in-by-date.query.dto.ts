import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class GetCheckInByDateQueryDto {
  @ApiProperty({ example: '111222333', description: 'Telegram user id' })
  @IsString()
  @Matches(/^\d+$/, { message: 'tgId must be numeric string' })
  tgId!: string;

  @ApiProperty({ example: '2026-01-20', description: 'Local date YYYY-MM-DD' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date must be YYYY-MM-DD' })
  date!: string;
}

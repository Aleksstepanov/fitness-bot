import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class GetCheckInsRangeQueryDto {
  @ApiProperty({ example: '111222333', description: 'Telegram user id' })
  @IsString()
  @Matches(/^\d+$/, { message: 'tgId must be numeric string' })
  tgId!: string;

  @ApiProperty({ example: '2026-01-20', description: 'Range start date' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'dateFrom must be YYYY-MM-DD',
  })
  dateFrom!: string;

  @ApiProperty({ example: '2026-01-26', description: 'Range end date' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'dateTo must be YYYY-MM-DD' })
  dateTo!: string;
}

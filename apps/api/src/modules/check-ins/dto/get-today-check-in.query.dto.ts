import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class GetTodayCheckInQueryDto {
  @ApiProperty({ example: '123456789', description: 'Telegram user id' })
  @IsString()
  @Matches(/^\d+$/, { message: 'tgId must be numeric string' })
  tgId!: string;
}

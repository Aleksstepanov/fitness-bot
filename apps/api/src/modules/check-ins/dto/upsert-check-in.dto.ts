import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';

import { ECheckInStatus } from '../entities/check-in.entity';

export class UpsertCheckInDto {
  @ApiProperty({
    example: '123456789',
    description: 'Telegram user id (numeric string)',
  })
  @IsString()
  @Matches(/^\d+$/, { message: 'tgId must be numeric string' })
  tgId!: string;

  @ApiProperty({ example: 'aleksey', required: false, nullable: true })
  @IsOptional()
  @IsString()
  username?: string | null;

  @ApiProperty({ example: '2026-01-20', description: 'Local date YYYY-MM-DD' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'checkInDate must be YYYY-MM-DD' })
  checkInDate!: string;

  @ApiProperty({ enum: ECheckInStatus, example: ECheckInStatus.DONE })
  @IsEnum(ECheckInStatus)
  status!: ECheckInStatus;

  @ApiProperty({
    required: false,
    nullable: true,
    example: 'Сделал 20 минут, норм.',
  })
  @IsOptional()
  @IsString()
  note?: string | null;
}

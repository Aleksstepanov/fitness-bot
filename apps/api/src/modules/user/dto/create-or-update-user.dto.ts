import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

export class CreateOrUpdateUserDto {
  @ApiProperty({
    example: '123456789',
    description: 'Telegram user id (bigint as string)',
  })
  @IsString()
  @Matches(/^\d+$/, { message: 'tgId must be numeric string' })
  tgId!: string;

  @ApiProperty({
    example: 'aleksey',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  username?: string | null;
}

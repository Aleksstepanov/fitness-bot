import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id!: string;

  @ApiProperty({ example: '123456789' })
  tgId!: string;

  @ApiProperty({ example: 'aleksey', nullable: true })
  username!: string | null;

  @ApiProperty({ example: '2026-01-20T11:30:00.000Z' })
  createdAt!: string;
}

import { ApiProperty } from '@nestjs/swagger';

export class HealthDto {
  @ApiProperty({ example: true })
  ok!: boolean;

  @ApiProperty({ example: '2026-01-20T10:00:00.000Z' })
  timestamp!: string;
}

export class DbHealthDto extends HealthDto {
  @ApiProperty({ example: 'up', enum: ['up', 'down'] })
  db!: 'up' | 'down';

  @ApiProperty({ example: 'password authentication failed', required: false })
  error?: string;
}

import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DataSource } from 'typeorm';

import { DbHealthDto, HealthDto } from './dto/health.dto';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly dataSource: DataSource) {}

  @ApiOkResponse({ type: HealthDto })
  @Get()
  getHealth(): HealthDto {
    return { ok: true, timestamp: new Date().toISOString() };
  }

  @ApiOkResponse({ type: DbHealthDto })
  @Get('db')
  async getDbHealth(): Promise<DbHealthDto> {
    try {
      await this.dataSource.query('SELECT 1');
      return { ok: true, db: 'up', timestamp: new Date().toISOString() };
    } catch (e) {
      return {
        ok: false,
        db: 'down',
        timestamp: new Date().toISOString(),
        error: e instanceof Error ? e.message : 'unknown error',
      };
    }
  }
}

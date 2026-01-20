import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @ApiOkResponse({
    schema: {
      example: { ok: true, timestamp: '2026-01-20T10:00:00.000Z' },
    },
  })
  @Get()
  getHealth() {
    return {
      ok: true,
      timestamp: new Date().toISOString(),
    };
  }
}

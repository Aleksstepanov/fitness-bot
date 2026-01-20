import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { UsersService } from '@/modules/user/users.service';
import { CheckInsService } from './check-ins.service';
import { UpsertCheckInDto } from './dto/upsert-check-in.dto';
import { CheckInResponseDto } from './dto/check-in.response.dto';
import { mapCheckInToResponse } from './check-ins.mapper';

@ApiTags('check-ins')
@Controller('check-ins')
export class CheckInsController {
  constructor(
    private readonly usersService: UsersService,
    private readonly checkInsService: CheckInsService,
  ) {}

  @ApiOkResponse({ type: CheckInResponseDto })
  @Post('debug-upsert')
  async upsert(@Body() dto: UpsertCheckInDto): Promise<CheckInResponseDto> {
    const user = await this.usersService.getOrCreateByTelegramUser({
      tgId: dto.tgId,
      username: dto.username ?? null,
    });

    const checkIn = await this.checkInsService.upsertDailyCheckIn({
      userId: user.id,
      checkInDate: dto.checkInDate,
      status: dto.status,
      note: dto.note ?? null,
    });

    return mapCheckInToResponse(checkIn);
  }
}

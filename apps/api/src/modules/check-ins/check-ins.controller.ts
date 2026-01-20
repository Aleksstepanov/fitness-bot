import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { UsersService } from '@/modules/user/users.service';
import { CheckInsService } from './check-ins.service';
import { UpsertCheckInDto } from './dto/upsert-check-in.dto';
import { CheckInResponseDto } from './dto/check-in.response.dto';
import { mapCheckInToResponse } from './check-ins.mapper';
import { Get, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { CheckInsWeekResponseDto } from './dto/check-ins-week.response.dto';

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

  @ApiOkResponse({
    type: CheckInResponseDto,
    description: 'Check-in for exact date (or null if not exists)',
  })
  @ApiQuery({ name: 'tgId', required: true, example: '111222333' })
  @ApiQuery({ name: 'date', required: true, example: '2026-01-20' })
  @Get('by-date')
  async getByDate(
    @Query('tgId') tgId: string,
    @Query('date') date: string,
  ): Promise<CheckInResponseDto | null> {
    const user = await this.usersService.findByTgId(tgId);
    if (!user) return null;

    const checkIn = await this.checkInsService.findByUserAndDate({
      userId: user.id,
      checkInDate: date,
    });

    return checkIn ? mapCheckInToResponse(checkIn) : null;
  }

  @ApiOkResponse({ type: CheckInsWeekResponseDto })
  @ApiQuery({ name: 'tgId', required: true, example: '111222333' })
  @ApiQuery({ name: 'dateFrom', required: true, example: '2026-01-20' })
  @ApiQuery({ name: 'dateTo', required: true, example: '2026-01-26' })
  @Get('range')
  async getRange(
    @Query('tgId') tgId: string,
    @Query('dateFrom') dateFrom: string,
    @Query('dateTo') dateTo: string,
  ): Promise<CheckInsWeekResponseDto> {
    const user = await this.usersService.findByTgId(tgId);
    if (!user) {
      return { dateFrom, dateTo, items: [] };
    }

    const items = await this.checkInsService.findRangeByUser({
      userId: user.id,
      dateFrom,
      dateTo,
    });

    return {
      dateFrom,
      dateTo,
      items: items.map(mapCheckInToResponse),
    };
  }
}

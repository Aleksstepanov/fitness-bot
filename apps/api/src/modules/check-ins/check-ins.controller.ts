import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';

import { UsersService } from '@/modules/user/users.service';
import { CheckInsService } from './check-ins.service';
import { UpsertCheckInDto } from './dto/upsert-check-in.dto';
import { CheckInResponseDto } from './dto/check-in.response.dto';
import { mapCheckInToResponse } from './check-ins.mapper';
import { CheckInsWeekResponseDto } from './dto/check-ins-week.response.dto';
import { GetCheckInByDateQueryDto } from './dto/get-check-in-by-date.query.dto';
import { GetCheckInsRangeQueryDto } from './dto/get-check-ins-range.query.dto';
import { GetTodayCheckInQueryDto } from './dto/get-today-check-in.query.dto';

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
    @Query() query: GetCheckInByDateQueryDto,
  ): Promise<CheckInResponseDto | null> {
    const user = await this.usersService.findByTgId(query.tgId);
    if (!user) return null;

    const checkIn = await this.checkInsService.findByUserAndDate({
      userId: user.id,
      checkInDate: query.date,
    });

    return checkIn ? mapCheckInToResponse(checkIn) : null;
  }

  @ApiOkResponse({ type: CheckInsWeekResponseDto })
  @ApiQuery({ name: 'tgId', required: true, example: '111222333' })
  @ApiQuery({ name: 'dateFrom', required: true, example: '2026-01-20' })
  @ApiQuery({ name: 'dateTo', required: true, example: '2026-01-26' })
  @Get('range')
  async getRange(
    @Query() query: GetCheckInsRangeQueryDto,
  ): Promise<CheckInsWeekResponseDto> {
    const user = await this.usersService.findByTgId(query.tgId);
    if (!user) {
      return { dateFrom: query.dateFrom, dateTo: query.dateTo, items: [] };
    }

    const items = await this.checkInsService.findRangeByUser({
      userId: user.id,
      dateFrom: query.dateFrom,
      dateTo: query.dateTo,
    });

    return {
      dateFrom: query.dateFrom,
      dateTo: query.dateTo,
      items: items.map(mapCheckInToResponse),
    };
  }

  @ApiOkResponse({
    type: CheckInResponseDto,
    description: 'Today check-in or null if not exists',
  })
  @ApiQuery({ name: 'tgId', required: true, example: '123456789' })
  @Get('today')
  async getToday(@Query() query: GetTodayCheckInQueryDto) {
    const user = await this.usersService.findByTgId(query.tgId);
    if (!user) {
      return null;
    }

    const checkIn = await this.checkInsService.findTodayByUser({
      userId: user.id,
      timezone: user.timezone,
    });

    return checkIn ? mapCheckInToResponse(checkIn) : null;
  }
}

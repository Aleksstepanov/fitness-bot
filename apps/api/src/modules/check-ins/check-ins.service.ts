import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Between } from 'typeorm';
import { getLocalDate } from '@/shared/utils/time/get-local-date';
import { CheckInEntity, ECheckInStatus } from './entities/check-in.entity';

@Injectable()
export class CheckInsService {
  constructor(
    @InjectRepository(CheckInEntity)
    private readonly checkInsRepo: Repository<CheckInEntity>,
  ) {}

  upsertDailyCheckIn = async (params: {
    userId: string;
    checkInDate: string; // YYYY-MM-DD
    status: ECheckInStatus;
    note?: string | null;
  }) => {
    const existing = await this.checkInsRepo.findOne({
      where: { userId: params.userId, checkInDate: params.checkInDate },
    });

    if (existing) {
      existing.status = params.status;
      existing.note = params.note ?? null;
      return this.checkInsRepo.save(existing);
    }

    const created = this.checkInsRepo.create({
      userId: params.userId,
      checkInDate: params.checkInDate,
      status: params.status,
      note: params.note ?? null,
    });

    return this.checkInsRepo.save(created);
  };

  findByUserAndDate = (params: { userId: string; checkInDate: string }) => {
    return this.checkInsRepo.findOne({
      where: { userId: params.userId, checkInDate: params.checkInDate },
      order: { createdAt: 'DESC' },
    });
  };

  findRangeByUser = (params: {
    userId: string;
    dateFrom: string;
    dateTo: string;
  }) => {
    return this.checkInsRepo.find({
      where: {
        userId: params.userId,
        checkInDate: Between(params.dateFrom, params.dateTo),
      },
      order: { checkInDate: 'ASC' },
    });
  };

  findTodayByUser = async (params: { userId: string; timezone: string }) => {
    const today = getLocalDate(params.timezone);

    return this.checkInsRepo.findOne({
      where: {
        userId: params.userId,
        checkInDate: today,
      },
    });
  };
}

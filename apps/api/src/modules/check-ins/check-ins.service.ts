import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
}

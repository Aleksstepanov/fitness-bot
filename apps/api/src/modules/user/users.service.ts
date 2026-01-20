import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './entities/user.entity';

export type TTelegramUser = {
  tgId: string;
  username?: string | null;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
  ) {}

  findByTgId = (tgId: string) => {
    return this.usersRepo.findOne({ where: { tgId } });
  };

  getOrCreateByTelegramUser = async ({ tgId, username }: TTelegramUser) => {
    const existing = await this.findByTgId(tgId);
    if (existing) {
      const nextUsername = username ?? null;
      if (existing.username !== nextUsername) {
        existing.username = nextUsername;
        return this.usersRepo.save(existing);
      }
      return existing;
    }

    const user = this.usersRepo.create({
      tgId,
      username: username ?? null,
    });

    return this.usersRepo.save(user);
  };
}

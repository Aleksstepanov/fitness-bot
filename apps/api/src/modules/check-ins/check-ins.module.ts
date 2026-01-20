import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '@/modules/user/user.module';
import { CheckInEntity } from './entities/check-in.entity';
import { CheckInsService } from './check-ins.service';
import { CheckInsController } from './check-ins.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CheckInEntity]), UsersModule],
  providers: [CheckInsService],
  controllers: [CheckInsController],
})
export class CheckInsModule {}

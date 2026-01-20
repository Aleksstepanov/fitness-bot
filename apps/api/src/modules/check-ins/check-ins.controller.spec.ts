import { Test, TestingModule } from '@nestjs/testing';
import { CheckInsController } from './check-ins.controller';
import { CheckInsService } from './check-ins.service';
import { UsersService } from '@/modules/user/users.service';
import { UpsertCheckInDto } from './dto/upsert-check-in.dto';
import { ECheckInStatus } from './entities/check-in.entity';
import * as mapper from './check-ins.mapper';

describe('CheckInsController', () => {
  let controller: CheckInsController;
  let usersService: UsersService;
  let checkInsService: CheckInsService;

  const mockUsersService = {
    getOrCreateByTelegramUser: jest.fn(),
  };

  const mockCheckInsService = {
    upsertDailyCheckIn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CheckInsController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: CheckInsService, useValue: mockCheckInsService },
      ],
    }).compile();

    controller = module.get<CheckInsController>(CheckInsController);
    usersService = module.get<UsersService>(UsersService);
    checkInsService = module.get<CheckInsService>(CheckInsService);
    jest.clearAllMocks();
  });

  describe('upsert', () => {
    it('should call usersService and checkInsService and return mapped result', async () => {
      const dto: UpsertCheckInDto = {
        tgId: '12345',
        username: 'testuser',
        checkInDate: '2026-01-20',
        status: ECheckInStatus.DONE,
        note: 'good day',
      };

      const mockUser = { id: 'user-uuid', tgId: '12345' };
      const mockCheckIn = {
        id: 'checkin-uuid',
        userId: 'user-uuid',
        checkInDate: '2026-01-20',
        status: ECheckInStatus.DONE,
        note: 'good day',
        createdAt: new Date(),
      };

      mockUsersService.getOrCreateByTelegramUser.mockResolvedValue(mockUser);
      mockCheckInsService.upsertDailyCheckIn.mockResolvedValue(mockCheckIn);

      const mapSpy = jest.spyOn(mapper, 'mapCheckInToResponse');

      const result = await controller.upsert(dto);

      expect(mockUsersService.getOrCreateByTelegramUser).toHaveBeenCalledWith({
        tgId: dto.tgId,
        username: dto.username,
      });
      expect(mockCheckInsService.upsertDailyCheckIn).toHaveBeenCalledWith({
        userId: mockUser.id,
        checkInDate: dto.checkInDate,
        status: dto.status,
        note: dto.note,
      });
      expect(mapSpy).toHaveBeenCalledWith(mockCheckIn);
      expect(result.id).toBe(mockCheckIn.id);
    });
  });
});

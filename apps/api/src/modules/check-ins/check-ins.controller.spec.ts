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
    findByTgId: jest.fn(),
  };

  const mockCheckInsService = {
    upsertDailyCheckIn: jest.fn(),
    findByUserAndDate: jest.fn(),
    findRangeByUser: jest.fn(),
    findTodayByUser: jest.fn(),
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

  describe('getByDate', () => {
    it('should return mapped check-in if found', async () => {
      const tgId = '123';
      const date = '2026-01-20';
      const mockUser = { id: 'user-1' };
      const mockCheckIn = {
        id: 'ci-1',
        checkInDate: date,
        createdAt: new Date()
      };

      mockUsersService.findByTgId.mockResolvedValue(mockUser);
      mockCheckInsService.findByUserAndDate.mockResolvedValue(mockCheckIn);

      const result = await controller.getByDate(tgId, date);

      expect(mockUsersService.findByTgId).toHaveBeenCalledWith(tgId);
      expect(mockCheckInsService.findByUserAndDate).toHaveBeenCalledWith({
        userId: mockUser.id,
        checkInDate: date,
      });
      expect(result).toBeDefined();
      expect(result?.id).toBe(mockCheckIn.id);
    });

    it('should return null if user not found', async () => {
      mockUsersService.findByTgId.mockResolvedValue(null);
      const result = await controller.getByDate('123', '2026-01-20');
      expect(result).toBeNull();
    });

    it('should return null if check-in not found', async () => {
      mockUsersService.findByTgId.mockResolvedValue({ id: 'user-1' });
      mockCheckInsService.findByUserAndDate.mockResolvedValue(null);
      const result = await controller.getByDate('123', '2026-01-20');
      expect(result).toBeNull();
    });
  });

  describe('getRange', () => {
    it('should return items list if user found', async () => {
      const tgId = '123';
      const from = '2026-01-20';
      const to = '2026-01-21';
      const mockUser = { id: 'user-1' };
      const mockItems = [
        { id: 'ci-1', createdAt: new Date() },
        { id: 'ci-2', createdAt: new Date() }
      ];

      mockUsersService.findByTgId.mockResolvedValue(mockUser);
      mockCheckInsService.findRangeByUser.mockResolvedValue(mockItems);

      const result = await controller.getRange(tgId, from, to);

      expect(result.dateFrom).toBe(from);
      expect(result.items).toHaveLength(2);
    });

    it('should return empty list if user not found', async () => {
      mockUsersService.findByTgId.mockResolvedValue(null);
      const result = await controller.getRange('123', '2026-01-20', '2026-01-21');
      expect(result.items).toEqual([]);
    });
  });

  describe('getToday', () => {
    it('should return today check-in if user and check-in exist', async () => {
      const tgId = '123';
      const mockUser = { id: 'user-1', timezone: 'Europe/Moscow' };
      const mockCheckIn = { id: 'ci-today', createdAt: new Date() };

      mockUsersService.findByTgId.mockResolvedValue(mockUser);
      mockCheckInsService.findTodayByUser.mockResolvedValue(mockCheckIn);

      const result = await controller.getToday(tgId);

      expect(mockUsersService.findByTgId).toHaveBeenCalledWith(tgId);
      expect(mockCheckInsService.findTodayByUser).toHaveBeenCalledWith({
        userId: mockUser.id,
        timezone: mockUser.timezone,
      });
      expect(result).toBeDefined();
      expect(result?.id).toBe(mockCheckIn.id);
    });

    it('should return null if user not found', async () => {
      mockUsersService.findByTgId.mockResolvedValue(null);
      const result = await controller.getToday('123');
      expect(result).toBeNull();
    });

    it('should return null if check-in not found', async () => {
      mockUsersService.findByTgId.mockResolvedValue({ id: 'user-1', timezone: 'UTC' });
      mockCheckInsService.findTodayByUser.mockResolvedValue(null);
      const result = await controller.getToday('123');
      expect(result).toBeNull();
    });
  });
});

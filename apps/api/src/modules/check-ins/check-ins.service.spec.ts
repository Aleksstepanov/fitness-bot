import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CheckInsService } from './check-ins.service';
import { CheckInEntity, ECheckInStatus } from './entities/check-in.entity';

describe('CheckInsService', () => {
  let service: CheckInsService;
  let repo: Repository<CheckInEntity>;

  const mockRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckInsService,
        {
          provide: getRepositoryToken(CheckInEntity),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<CheckInsService>(CheckInsService);
    repo = module.get<Repository<CheckInEntity>>(getRepositoryToken(CheckInEntity));
    jest.clearAllMocks();
  });

  describe('upsertDailyCheckIn', () => {
    const params = {
      userId: 'user-id',
      checkInDate: '2026-01-20',
      status: ECheckInStatus.DONE,
      note: 'test note',
    };

    it('should update existing check-in', async () => {
      const existing = { id: '1', ...params } as CheckInEntity;
      mockRepo.findOne.mockResolvedValue(existing);
      mockRepo.save.mockResolvedValue({ ...existing, status: ECheckInStatus.SKIPPED });

      const result = await service.upsertDailyCheckIn({
        ...params,
        status: ECheckInStatus.SKIPPED,
      });

      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: { userId: params.userId, checkInDate: params.checkInDate },
      });
      expect(existing.status).toBe(ECheckInStatus.SKIPPED);
      expect(mockRepo.save).toHaveBeenCalledWith(existing);
      expect(result.status).toBe(ECheckInStatus.SKIPPED);
    });

    it('should create new check-in if not exists', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      const createdEntity = { ...params };
      mockRepo.create.mockReturnValue(createdEntity);
      mockRepo.save.mockResolvedValue({ id: 'new-id', ...params });

      const result = await service.upsertDailyCheckIn(params);

      expect(mockRepo.findOne).toHaveBeenCalled();
      expect(mockRepo.create).toHaveBeenCalledWith({
        userId: params.userId,
        checkInDate: params.checkInDate,
        status: params.status,
        note: params.note,
      });
      expect(mockRepo.save).toHaveBeenCalledWith(createdEntity);
      expect(result.id).toBe('new-id');
    });

    it('should use null if note is undefined', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      const paramsWithoutNote = {
        userId: 'user-id',
        checkInDate: '2026-01-20',
        status: ECheckInStatus.DONE,
      };
      
      await service.upsertDailyCheckIn(paramsWithoutNote);

      expect(mockRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ note: null })
      );
    });
  });

  describe('findByUserAndDate', () => {
    it('should call findOne with correct params', async () => {
      const params = { userId: 'u1', checkInDate: '2026-01-20' };
      await service.findByUserAndDate(params);
      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: { userId: params.userId, checkInDate: params.checkInDate },
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findRangeByUser', () => {
    it('should call find with Between operator', async () => {
      const params = { userId: 'u1', dateFrom: '2026-01-01', dateTo: '2026-01-07' };
      await service.findRangeByUser(params);
      expect(mockRepo.find).toHaveBeenCalledWith({
        where: {
          userId: params.userId,
          checkInDate: expect.anything(),
        },
        order: { checkInDate: 'ASC' },
      });
    });
  });
});

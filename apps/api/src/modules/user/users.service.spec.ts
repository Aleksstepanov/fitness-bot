import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<UserEntity>;

  const mockRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByTgId', () => {
    it('should call repo.findOne with correct params', async () => {
      const tgId = '123';
      const user = { id: 'uuid', tgId } as UserEntity;
      mockRepo.findOne.mockResolvedValue(user);

      const result = await service.findByTgId(tgId);

      expect(repo.findOne).toHaveBeenCalledWith({ where: { tgId } });
      expect(result).toBe(user);
    });
  });

  describe('getOrCreateByTelegramUser', () => {
    it('should return existing user if found and username matches', async () => {
      const tgId = '123';
      const username = 'test';
      const existingUser = { id: 'uuid', tgId, username } as UserEntity;

      jest.spyOn(service, 'findByTgId').mockResolvedValue(existingUser);

      const result = await service.getOrCreateByTelegramUser({
        tgId,
        username,
      });

      expect(service.findByTgId).toHaveBeenCalledWith(tgId);
      expect(mockRepo.save).not.toHaveBeenCalled();
      expect(result).toBe(existingUser);
    });

    it('should update username if existing user found but username differs', async () => {
      const tgId = '123';
      const oldUsername = 'old';
      const newUsername = 'new';
      const existingUser = {
        id: 'uuid',
        tgId,
        username: oldUsername,
      } as UserEntity;

      jest.spyOn(service, 'findByTgId').mockResolvedValue(existingUser);
      mockRepo.save.mockImplementation((user) => Promise.resolve(user));

      const result = await service.getOrCreateByTelegramUser({
        tgId,
        username: newUsername,
      });

      expect(existingUser.username).toBe(newUsername);
      expect(mockRepo.save).toHaveBeenCalledWith(existingUser);
      expect(result).toBe(existingUser);
    });

    it('should create and save new user if not found', async () => {
      const tgId = '123';
      const username = 'newuser';

      jest.spyOn(service, 'findByTgId').mockResolvedValue(null);
      const newUser = { tgId, username } as UserEntity;
      mockRepo.create.mockReturnValue(newUser);
      mockRepo.save.mockResolvedValue(newUser);

      const result = await service.getOrCreateByTelegramUser({
        tgId,
        username,
      });

      expect(mockRepo.create).toHaveBeenCalledWith({ tgId, username });
      expect(mockRepo.save).toHaveBeenCalledWith(newUser);
      expect(result).toBe(newUser);
    });

    it('should handle null username when creating', async () => {
      const tgId = '123';

      jest.spyOn(service, 'findByTgId').mockResolvedValue(null);
      mockRepo.create.mockReturnValue({});
      mockRepo.save.mockResolvedValue({});

      await service.getOrCreateByTelegramUser({ tgId, username: undefined });

      expect(mockRepo.create).toHaveBeenCalledWith({ tgId, username: null });
    });
  });
});

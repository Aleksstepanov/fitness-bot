import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import * as mapper from './users.mapper';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    getOrCreateByTelegramUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('upsert', () => {
    it('should call service.getOrCreateByTelegramUser and return mapped result', async () => {
      const dto = { tgId: '123', username: 'test' };
      const user = {
        id: 'uuid',
        tgId: '123',
        username: 'test',
        timezone: 'Europe/Moscow',
        createdAt: new Date(),
      } as UserEntity;

      mockUsersService.getOrCreateByTelegramUser.mockResolvedValue(user);

      const spyMapper = jest.spyOn(mapper, 'mapUserToResponse');

      const result = await controller.upsert(dto);

      expect(service.getOrCreateByTelegramUser).toHaveBeenCalledWith(dto);
      expect(spyMapper).toHaveBeenCalledWith(user);
      expect(result).toEqual({
        id: user.id,
        tgId: user.tgId,
        username: user.username,
        createdAt: user.createdAt.toISOString(),
      });
    });
  });
});

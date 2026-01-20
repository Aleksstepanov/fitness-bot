import { UserEntity } from './entities/user.entity';
import { mapUserToResponse } from './users.mapper';

describe('users.mapper', () => {
  it('should map UserEntity to UserResponseDto', () => {
    const date = new Date();
    const user: UserEntity = {
      id: 'uuid',
      tgId: '12345',
      username: 'testuser',
      createdAt: date,
    };

    const result = mapUserToResponse(user);

    expect(result).toEqual({
      id: 'uuid',
      tgId: '12345',
      username: 'testuser',
      createdAt: date.toISOString(),
    });
  });

  it('should handle null username', () => {
    const date = new Date();
    const user: UserEntity = {
      id: 'uuid2',
      tgId: '67890',
      username: null,
      createdAt: date,
    };

    const result = mapUserToResponse(user);

    expect(result.username).toBeNull();
  });
});

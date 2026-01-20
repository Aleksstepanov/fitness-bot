import { UserEntity } from './entities/user.entity';
import { UserResponseDto } from './dto/user.response.dto';

export const mapUserToResponse = (user: UserEntity): UserResponseDto => ({
  id: user.id,
  tgId: user.tgId,
  username: user.username,
  createdAt: user.createdAt.toISOString(),
});

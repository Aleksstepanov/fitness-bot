import { CheckInEntity } from './entities/check-in.entity';
import { CheckInResponseDto } from './dto/check-in.response.dto';

export const mapCheckInToResponse = (c: CheckInEntity): CheckInResponseDto => ({
  id: c.id,
  userId: c.userId,
  checkInDate: c.checkInDate,
  status: c.status,
  note: c.note,
  createdAt: c.createdAt.toISOString(),
});

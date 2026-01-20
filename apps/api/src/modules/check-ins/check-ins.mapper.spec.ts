import { CheckInEntity, ECheckInStatus } from './entities/check-in.entity';
import { mapCheckInToResponse } from './check-ins.mapper';

describe('CheckInsMapper', () => {
  it('should map CheckInEntity to CheckInResponseDto', () => {
    const date = new Date('2026-01-20T12:00:00Z');
    const entity: CheckInEntity = {
      id: 'uuid',
      userId: 'user-uuid',
      checkInDate: '2026-01-20',
      status: ECheckInStatus.DONE,
      note: 'Everything is fine',
      createdAt: date,
    } as CheckInEntity;

    const result = mapCheckInToResponse(entity);

    expect(result).toEqual({
      id: 'uuid',
      userId: 'user-uuid',
      checkInDate: '2026-01-20',
      status: ECheckInStatus.DONE,
      note: 'Everything is fine',
      createdAt: date.toISOString(),
    });
  });

  it('should handle null note', () => {
    const date = new Date('2026-01-20T12:00:00Z');
    const entity: CheckInEntity = {
      id: 'uuid',
      userId: 'user-uuid',
      checkInDate: '2026-01-20',
      status: ECheckInStatus.SKIPPED,
      note: null,
      createdAt: date,
    } as CheckInEntity;

    const result = mapCheckInToResponse(entity);

    expect(result.note).toBeNull();
  });
});

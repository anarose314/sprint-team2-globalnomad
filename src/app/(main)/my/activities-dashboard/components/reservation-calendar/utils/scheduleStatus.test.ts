import { describe, expect, it } from 'vitest';
import { isScheduleStartReached } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/utils/scheduleStatus';

describe('isScheduleStartReached', () => {
  it('시작 시각을 지난 경우 true를 반환한다', () => {
    const now = new Date(2026, 5, 30, 14, 1, 0);

    expect(isScheduleStartReached('2026-06-30', '14:00', now)).toBe(true);
  });

  it('시작 시각 전이면 false를 반환한다', () => {
    const now = new Date(2026, 5, 30, 13, 59, 59);

    expect(isScheduleStartReached('2026-06-30', '14:00', now)).toBe(false);
  });

  it('잘못된 날짜 문자열이면 false를 반환한다', () => {
    const now = new Date(2026, 5, 30, 14, 1, 0);

    expect(isScheduleStartReached('invalid-date', '14:00', now)).toBe(false);
  });
});

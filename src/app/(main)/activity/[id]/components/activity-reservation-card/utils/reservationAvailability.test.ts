import { describe, expect, it } from 'vitest';
import { buildReservationAvailability } from '@/app/(main)/activity/[id]/components/activity-reservation-card/utils/reservationAvailability';
import type {
  ActivityAvailableScheduleItem,
  ActivitySchedule,
} from '@/shared/types/activityDetail.types';

const NOW = new Date('2026-07-15T00:00:00');

const schedules: ActivitySchedule[] = [
  { id: 1, date: '2026-07-01', startTime: '09:00', endTime: '10:00' },
  { id: 2, date: '2026-07-20', startTime: '09:00', endTime: '10:00' },
  { id: 3, date: '2026-07-21', startTime: '13:00', endTime: '14:00' },
];

describe('buildReservationAvailability', () => {
  it('정상 응답이면 API 응답을 그대로 사용하고 usesFallbackSchedule은 false다', () => {
    const availableSchedules: ActivityAvailableScheduleItem[] = [
      {
        date: '2026-07-20',
        times: [{ id: 2, startTime: '09:00', endTime: '10:00' }],
      },
    ];

    const result = buildReservationAvailability({
      schedules,
      availableSchedules,
      availableScheduleQueryStatus: 'success',
      blockedScheduleIds: [],
      now: NOW,
    });

    expect(result.usesFallbackSchedule).toBe(false);
    expect(result.availableScheduleByDate).toEqual({
      '2026-07-20': [{ id: 2, startTime: '09:00', endTime: '10:00' }],
    });
  });

  it('빈 응답(정상이지만 결과 없음)이면 원본 스케줄로 대체하고 usesFallbackSchedule은 true다', () => {
    const result = buildReservationAvailability({
      schedules,
      availableSchedules: [],
      availableScheduleQueryStatus: 'success',
      blockedScheduleIds: [],
      now: NOW,
    });

    expect(result.usesFallbackSchedule).toBe(true);
    expect(result.availableScheduleByDate).toEqual({
      '2026-07-20': [{ id: 2, startTime: '09:00', endTime: '10:00' }],
      '2026-07-21': [{ id: 3, startTime: '13:00', endTime: '14:00' }],
    });
  });

  it('로딩/오류 상태면 API 응답과 무관하게 원본 스케줄로 대체한다', () => {
    const availableSchedules: ActivityAvailableScheduleItem[] = [
      {
        date: '2026-07-20',
        times: [{ id: 2, startTime: '09:00', endTime: '10:00' }],
      },
    ];

    const loadingResult = buildReservationAvailability({
      schedules,
      availableSchedules,
      availableScheduleQueryStatus: 'loading',
      blockedScheduleIds: [],
      now: NOW,
    });
    const errorResult = buildReservationAvailability({
      schedules,
      availableSchedules,
      availableScheduleQueryStatus: 'error',
      blockedScheduleIds: [],
      now: NOW,
    });

    expect(loadingResult.usesFallbackSchedule).toBe(true);
    expect(errorResult.usesFallbackSchedule).toBe(true);
    expect(loadingResult.availableScheduleByDate).toEqual(
      errorResult.availableScheduleByDate
    );
    expect(Object.keys(loadingResult.availableScheduleByDate)).toEqual([
      '2026-07-20',
      '2026-07-21',
    ]);
  });

  it('지난 시간대는 결과에서 제외한다', () => {
    const result = buildReservationAvailability({
      schedules,
      availableSchedules: [],
      availableScheduleQueryStatus: 'success',
      blockedScheduleIds: [],
      now: NOW,
    });

    expect(result.availableScheduleByDate['2026-07-01']).toBeUndefined();
  });

  it('이미 예약이 완료된 스케줄(blockedScheduleIds)은 대체 데이터에서 제외한다', () => {
    const result = buildReservationAvailability({
      schedules,
      availableSchedules: [],
      availableScheduleQueryStatus: 'success',
      blockedScheduleIds: [2],
      now: NOW,
    });

    expect(result.availableScheduleByDate['2026-07-20']).toBeUndefined();
    expect(result.availableScheduleByDate['2026-07-21']).toEqual([
      { id: 3, startTime: '13:00', endTime: '14:00' },
    ]);
  });

  it('이미 예약이 완료된 스케줄(blockedScheduleIds)은 API 응답에서도 제외한다', () => {
    const availableSchedules: ActivityAvailableScheduleItem[] = [
      {
        date: '2026-07-20',
        times: [
          { id: 2, startTime: '09:00', endTime: '10:00' },
          { id: 4, startTime: '15:00', endTime: '16:00' },
        ],
      },
    ];

    const result = buildReservationAvailability({
      schedules,
      availableSchedules,
      availableScheduleQueryStatus: 'success',
      blockedScheduleIds: [2],
      now: NOW,
    });

    expect(result.usesFallbackSchedule).toBe(false);
    expect(result.availableScheduleByDate).toEqual({
      '2026-07-20': [{ id: 4, startTime: '15:00', endTime: '16:00' }],
    });
  });

  it('중복 예약 필터링으로 API 응답의 모든 날짜가 비면 원본 스케줄로 대체한다', () => {
    const availableSchedules: ActivityAvailableScheduleItem[] = [
      {
        date: '2026-07-20',
        times: [{ id: 2, startTime: '09:00', endTime: '10:00' }],
      },
    ];

    const result = buildReservationAvailability({
      schedules,
      availableSchedules,
      availableScheduleQueryStatus: 'success',
      blockedScheduleIds: [2],
      now: NOW,
    });

    expect(result.usesFallbackSchedule).toBe(true);
    expect(result.availableScheduleByDate['2026-07-21']).toEqual([
      { id: 3, startTime: '13:00', endTime: '14:00' },
    ]);
  });
});

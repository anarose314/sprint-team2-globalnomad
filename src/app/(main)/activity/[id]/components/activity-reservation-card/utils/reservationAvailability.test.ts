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
  it('원본 스케줄과 예약 가능 결과에 모두 포함된 시간은 available이다', () => {
    const availableSchedules: ActivityAvailableScheduleItem[] = [
      {
        date: '2026-07-20',
        times: [{ id: 2, startTime: '09:00', endTime: '10:00' }],
      },
    ];

    const result = buildReservationAvailability({
      schedules,
      availableSchedules,
      availableScheduleQueryStatusByMonth: { '2026-07': 'success' },
      myScheduleIds: [],
      myScheduleQueryStatus: 'success',
      now: NOW,
    });

    expect(result.scheduleByDate['2026-07-20']).toEqual([
      { id: 2, startTime: '09:00', endTime: '10:00', status: 'available' },
    ]);
  });

  it('내 예약 조회가 끝나지 않았거나 실패하면 예약 가능 응답이 있어도 unavailable이다', () => {
    const availableSchedules: ActivityAvailableScheduleItem[] = [
      {
        date: '2026-07-20',
        times: [{ id: 2, startTime: '09:00', endTime: '10:00' }],
      },
    ];
    const baseParams = {
      schedules,
      availableSchedules,
      availableScheduleQueryStatusByMonth: { '2026-07': 'success' } as const,
      myScheduleIds: [],
      now: NOW,
    };

    const loadingResult = buildReservationAvailability({
      ...baseParams,
      myScheduleQueryStatus: 'loading',
    });
    const errorResult = buildReservationAvailability({
      ...baseParams,
      myScheduleQueryStatus: 'error',
    });

    expect(loadingResult.scheduleByDate['2026-07-20'][0].status).toBe(
      'unavailable'
    );
    expect(errorResult.scheduleByDate['2026-07-20'][0].status).toBe(
      'unavailable'
    );
  });

  it('원본 스케줄에는 있지만 예약 가능 결과에는 없는 시간은 unavailable이다', () => {
    const result = buildReservationAvailability({
      schedules,
      availableSchedules: [],
      availableScheduleQueryStatusByMonth: { '2026-07': 'success' },
      myScheduleIds: [],
      myScheduleQueryStatus: 'success',
      now: NOW,
    });

    expect(result.scheduleByDate['2026-07-20']).toEqual([
      { id: 2, startTime: '09:00', endTime: '10:00', status: 'unavailable' },
    ]);
    expect(result.scheduleByDate['2026-07-21']).toEqual([
      { id: 3, startTime: '13:00', endTime: '14:00', status: 'unavailable' },
    ]);
  });

  it('조회가 loading/error 상태면 예약 가능 결과와 무관하게 unavailable로 표시한다', () => {
    const availableSchedules: ActivityAvailableScheduleItem[] = [
      {
        date: '2026-07-20',
        times: [{ id: 2, startTime: '09:00', endTime: '10:00' }],
      },
    ];

    const loadingResult = buildReservationAvailability({
      schedules,
      availableSchedules,
      availableScheduleQueryStatusByMonth: { '2026-07': 'loading' },
      myScheduleIds: [],
      myScheduleQueryStatus: 'success',
      now: NOW,
    });
    const errorResult = buildReservationAvailability({
      schedules,
      availableSchedules,
      availableScheduleQueryStatusByMonth: { '2026-07': 'error' },
      myScheduleIds: [],
      myScheduleQueryStatus: 'success',
      now: NOW,
    });

    expect(loadingResult.scheduleByDate['2026-07-20']).toEqual([
      { id: 2, startTime: '09:00', endTime: '10:00', status: 'unavailable' },
    ]);
    expect(errorResult.scheduleByDate['2026-07-20']).toEqual(
      loadingResult.scheduleByDate['2026-07-20']
    );
  });

  it('오늘 이전 날짜는 결과에서 완전히 제외한다', () => {
    const result = buildReservationAvailability({
      schedules,
      availableSchedules: [],
      availableScheduleQueryStatusByMonth: { '2026-07': 'success' },
      myScheduleIds: [],
      myScheduleQueryStatus: 'success',
      now: NOW,
    });

    expect(result.scheduleByDate['2026-07-01']).toBeUndefined();
  });

  it('오늘 날짜의 지난 시간대는 표시하되 unavailable로 선택할 수 없게 한다', () => {
    const now = new Date('2026-07-15T12:00:00');
    const todaySchedules: ActivitySchedule[] = [
      { id: 10, date: '2026-07-15', startTime: '09:00', endTime: '10:00' },
      { id: 11, date: '2026-07-15', startTime: '15:00', endTime: '16:00' },
    ];

    const result = buildReservationAvailability({
      schedules: todaySchedules,
      availableSchedules: [
        {
          date: '2026-07-15',
          times: [{ id: 11, startTime: '15:00', endTime: '16:00' }],
        },
      ],
      availableScheduleQueryStatusByMonth: { '2026-07': 'success' },
      myScheduleIds: [],
      myScheduleQueryStatus: 'success',
      now,
    });

    expect(result.scheduleByDate['2026-07-15']).toEqual([
      { id: 10, startTime: '09:00', endTime: '10:00', status: 'unavailable' },
      { id: 11, startTime: '15:00', endTime: '16:00', status: 'available' },
    ]);
  });

  it('오늘 날짜의 지난 시간대라도 내 예약이면 mine을 유지한다', () => {
    const now = new Date('2026-07-15T12:00:00');
    const todaySchedules: ActivitySchedule[] = [
      { id: 10, date: '2026-07-15', startTime: '09:00', endTime: '10:00' },
    ];

    const result = buildReservationAvailability({
      schedules: todaySchedules,
      availableSchedules: [],
      availableScheduleQueryStatusByMonth: { '2026-07': 'success' },
      myScheduleIds: [10],
      myScheduleQueryStatus: 'success',
      now,
    });

    expect(result.scheduleByDate['2026-07-15']).toEqual([
      { id: 10, startTime: '09:00', endTime: '10:00', status: 'mine' },
    ]);
  });

  it('내 예약 목록에 포함된 시간은 예약 가능 결과와 무관하게 mine이다', () => {
    const availableSchedules: ActivityAvailableScheduleItem[] = [
      {
        date: '2026-07-20',
        times: [{ id: 2, startTime: '09:00', endTime: '10:00' }],
      },
    ];

    const result = buildReservationAvailability({
      schedules,
      availableSchedules,
      availableScheduleQueryStatusByMonth: { '2026-07': 'success' },
      myScheduleIds: [2],
      myScheduleQueryStatus: 'success',
      now: NOW,
    });

    expect(result.scheduleByDate['2026-07-20']).toEqual([
      { id: 2, startTime: '09:00', endTime: '10:00', status: 'mine' },
    ]);
  });

  it('내 예약이 예약 가능 결과에 없어도(정상 케이스) mine으로 우선 판단한다', () => {
    const result = buildReservationAvailability({
      schedules,
      availableSchedules: [],
      availableScheduleQueryStatusByMonth: { '2026-07': 'success' },
      myScheduleIds: [3],
      myScheduleQueryStatus: 'success',
      now: NOW,
    });

    expect(result.scheduleByDate['2026-07-21']).toEqual([
      { id: 3, startTime: '13:00', endTime: '14:00', status: 'mine' },
    ]);
  });

  it('예약 가능한 시간이 없는 미래 날짜도 원본 스케줄 기준으로 날짜 키를 유지한다', () => {
    const result = buildReservationAvailability({
      schedules,
      availableSchedules: [],
      availableScheduleQueryStatusByMonth: { '2026-07': 'success' },
      myScheduleIds: [],
      myScheduleQueryStatus: 'success',
      now: NOW,
    });

    expect(Object.keys(result.scheduleByDate)).toEqual([
      '2026-07-20',
      '2026-07-21',
    ]);
  });

  it('일부 연월의 조회만 실패하면 성공한 연월의 시간은 예약 가능 상태를 유지한다', () => {
    const multiMonthSchedules: ActivitySchedule[] = [
      { id: 20, date: '2026-07-20', startTime: '09:00', endTime: '10:00' },
      { id: 21, date: '2026-08-20', startTime: '09:00', endTime: '10:00' },
    ];
    const availableSchedules: ActivityAvailableScheduleItem[] = [
      {
        date: '2026-07-20',
        times: [{ id: 20, startTime: '09:00', endTime: '10:00' }],
      },
      {
        date: '2026-08-20',
        times: [{ id: 21, startTime: '09:00', endTime: '10:00' }],
      },
    ];

    const result = buildReservationAvailability({
      schedules: multiMonthSchedules,
      availableSchedules,
      availableScheduleQueryStatusByMonth: {
        '2026-07': 'success',
        '2026-08': 'error',
      },
      myScheduleIds: [],
      myScheduleQueryStatus: 'success',
      now: NOW,
    });

    expect(result.scheduleByDate['2026-07-20']).toEqual([
      { id: 20, startTime: '09:00', endTime: '10:00', status: 'available' },
    ]);
    expect(result.scheduleByDate['2026-08-20']).toEqual([
      { id: 21, startTime: '09:00', endTime: '10:00', status: 'unavailable' },
    ]);
  });
});

import { describe, expect, it } from 'vitest';
import { buildReservationCalendarDisplayData } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/utils/buildReservationCalendarDisplayData';
import type { ReservationDashboardDailyItem } from '@/shared/types/reservationDashboard.types';
import type { ReservedScheduleItem } from '@/shared/types/reservedSchedule.types';

const TODAY = '2026-07-15';
const NOW = new Date('2026-07-15T10:00:00');

const dashboardItem = (
  date: string,
  reservations: Partial<ReservationDashboardDailyItem['reservations']> = {}
): ReservationDashboardDailyItem => ({
  date,
  reservations: {
    completed: 0,
    confirmed: 0,
    declined: 0,
    pending: 0,
    ...reservations,
  },
});

const schedule = (
  overrides: Partial<ReservedScheduleItem> = {}
): ReservedScheduleItem => ({
  scheduleId: 1,
  startTime: '09:00',
  endTime: '10:00',
  count: { declined: 0, confirmed: 0, pending: 0 },
  ...overrides,
});

describe('buildReservationCalendarDisplayData', () => {
  it('지난 날짜는 대기를 숨기고 승인을 완료로 넘긴다', () => {
    const result = buildReservationCalendarDisplayData({
      reservationDashboard: [
        dashboardItem('2026-07-14', { pending: 2, confirmed: 3 }),
      ],
      reservedScheduleDateKey: null,
      reservedSchedulesSelected: [],
      reservedSchedulesToday: [],
      isTodayScheduleFetchRequired: false,
      todayDateKey: TODAY,
      now: NOW,
    });

    expect(result.eventCountsByDate['2026-07-14']).toEqual({ completed: 3 });
    expect(result.notificationDotByDate['2026-07-14']).toBe(true);
  });

  it('오늘 날짜는 대기/승인 상태를 그대로 표시한다', () => {
    const result = buildReservationCalendarDisplayData({
      reservationDashboard: [
        dashboardItem(TODAY, { pending: 1, confirmed: 2, completed: 1 }),
      ],
      reservedScheduleDateKey: null,
      reservedSchedulesSelected: [],
      reservedSchedulesToday: [],
      isTodayScheduleFetchRequired: false,
      todayDateKey: TODAY,
      now: NOW,
    });

    expect(result.eventCountsByDate[TODAY]).toEqual({
      pending: 1,
      confirmed: 2,
      completed: 1,
    });
    expect(result.notificationDotByDate[TODAY]).toBe(true);
  });

  it('미래 날짜는 대기/승인 상태를 그대로 표시한다', () => {
    const result = buildReservationCalendarDisplayData({
      reservationDashboard: [dashboardItem('2026-07-20', { pending: 4 })],
      reservedScheduleDateKey: null,
      reservedSchedulesSelected: [],
      reservedSchedulesToday: [],
      isTodayScheduleFetchRequired: false,
      todayDateKey: TODAY,
      now: NOW,
    });

    expect(result.eventCountsByDate['2026-07-20']).toEqual({ pending: 4 });
    expect(result.notificationDotByDate['2026-07-20']).toBe(true);
  });

  it('예약이 없는 날짜는 배지와 알림 도트가 없다', () => {
    const result = buildReservationCalendarDisplayData({
      reservationDashboard: [dashboardItem('2026-07-16')],
      reservedScheduleDateKey: null,
      reservedSchedulesSelected: [],
      reservedSchedulesToday: [],
      isTodayScheduleFetchRequired: false,
      todayDateKey: TODAY,
      now: NOW,
    });

    expect(result.eventCountsByDate['2026-07-16']).toBeUndefined();
    expect(result.notificationDotByDate['2026-07-16']).toBeUndefined();
  });

  it('거절만 있는 날짜는 배지 없이 알림 도트만 켠다', () => {
    const result = buildReservationCalendarDisplayData({
      reservationDashboard: [dashboardItem('2026-07-16', { declined: 2 })],
      reservedScheduleDateKey: null,
      reservedSchedulesSelected: [],
      reservedSchedulesToday: [],
      isTodayScheduleFetchRequired: false,
      todayDateKey: TODAY,
      now: NOW,
    });

    expect(result.eventCountsByDate['2026-07-16']).toBeUndefined();
    expect(result.notificationDotByDate['2026-07-16']).toBe(true);
  });

  it('대기·승인·완료 상태가 함께 존재하는 미래 날짜를 그대로 반영한다', () => {
    const result = buildReservationCalendarDisplayData({
      reservationDashboard: [
        dashboardItem('2026-07-20', {
          pending: 1,
          confirmed: 2,
          completed: 3,
        }),
      ],
      reservedScheduleDateKey: null,
      reservedSchedulesSelected: [],
      reservedSchedulesToday: [],
      isTodayScheduleFetchRequired: false,
      todayDateKey: TODAY,
      now: NOW,
    });

    expect(result.eventCountsByDate['2026-07-20']).toEqual({
      pending: 1,
      confirmed: 2,
      completed: 3,
    });
  });

  it('대시보드에 없는 날짜라도 선택 날짜 스케줄에 예약 활동이 있으면 알림 도트를 켠다', () => {
    const result = buildReservationCalendarDisplayData({
      reservationDashboard: [],
      reservedScheduleDateKey: '2026-07-18',
      reservedSchedulesSelected: [
        schedule({ count: { declined: 0, confirmed: 0, pending: 1 } }),
      ],
      reservedSchedulesToday: [],
      isTodayScheduleFetchRequired: false,
      todayDateKey: TODAY,
      now: NOW,
    });

    expect(result.notificationDotByDate['2026-07-18']).toBe(true);
    expect(result.eventCountsByDate['2026-07-18']).toEqual({ pending: 1 });
  });

  it('대시보드 응답 일부가 비어 있어도 reserved-schedule로 배지 집계를 보정한다', () => {
    const result = buildReservationCalendarDisplayData({
      reservationDashboard: [dashboardItem('2026-07-18', { pending: 0 })],
      reservedScheduleDateKey: '2026-07-18',
      reservedSchedulesSelected: [
        schedule({
          startTime: '09:00',
          endTime: '10:00',
          count: { declined: 0, confirmed: 2, pending: 0 },
        }),
      ],
      reservedSchedulesToday: [],
      isTodayScheduleFetchRequired: false,
      todayDateKey: TODAY,
      now: NOW,
    });

    expect(result.eventCountsByDate['2026-07-18']).toEqual({ confirmed: 2 });
  });

  it('선택 날짜와 오늘 날짜가 같으면 오늘 스케줄을 중복 반영하지 않는다', () => {
    const result = buildReservationCalendarDisplayData({
      reservationDashboard: [],
      reservedScheduleDateKey: TODAY,
      reservedSchedulesSelected: [
        schedule({
          endTime: '11:00',
          count: { declined: 0, confirmed: 1, pending: 0 },
        }),
      ],
      reservedSchedulesToday: [
        schedule({
          endTime: '11:00',
          count: { declined: 0, confirmed: 5, pending: 0 },
        }),
      ],
      isTodayScheduleFetchRequired: true,
      todayDateKey: TODAY,
      now: NOW,
    });

    expect(result.eventCountsByDate[TODAY]).toEqual({ confirmed: 1 });
  });

  it('오늘 스케줄 조회가 필요하지 않으면 오늘 스케줄 응답을 반영하지 않는다', () => {
    const result = buildReservationCalendarDisplayData({
      reservationDashboard: [],
      reservedScheduleDateKey: null,
      reservedSchedulesSelected: [],
      reservedSchedulesToday: [
        schedule({ count: { declined: 0, confirmed: 5, pending: 0 } }),
      ],
      isTodayScheduleFetchRequired: false,
      todayDateKey: TODAY,
      now: NOW,
    });

    expect(result.eventCountsByDate[TODAY]).toBeUndefined();
    expect(result.notificationDotByDate[TODAY]).toBeUndefined();
  });

  it('체험 종료 시각이 지난 승인 슬롯은 완료로 집계한다', () => {
    const result = buildReservationCalendarDisplayData({
      reservationDashboard: [],
      reservedScheduleDateKey: TODAY,
      reservedSchedulesSelected: [
        schedule({
          startTime: '08:00',
          endTime: '09:00',
          count: { declined: 0, confirmed: 3, pending: 0 },
        }),
      ],
      reservedSchedulesToday: [],
      isTodayScheduleFetchRequired: false,
      todayDateKey: TODAY,
      now: NOW,
    });

    expect(result.eventCountsByDate[TODAY]).toEqual({ completed: 3 });
  });
});

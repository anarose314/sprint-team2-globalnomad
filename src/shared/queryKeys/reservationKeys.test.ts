import { describe, expect, it } from 'vitest';
import { reservationKeys } from '@/shared/queryKeys/reservationKeys';

describe('reservationKeys.myReservations', () => {
  it('상태값에 따라 목록 키를 생성한다', () => {
    expect(reservationKeys.myReservations.list('pending')).toEqual([
      'myReservations',
      'pending',
    ]);
  });

  it('상태값이 없으면 null을 사용한다', () => {
    expect(reservationKeys.myReservations.list()).toEqual([
      'myReservations',
      null,
    ]);
  });

  it('목록/상세 캐시 무효화에 사용하는 상위 키는 모든 목록 키의 접두사이다', () => {
    const root = reservationKeys.myReservations.all;
    const list = reservationKeys.myReservations.list('confirmed');
    const reservedSchedules =
      reservationKeys.myReservations.reservedSchedules();

    expect(list.slice(0, root.length)).toEqual(root);
    expect(reservedSchedules.slice(0, root.length)).toEqual(root);
  });
});

describe('reservationKeys.availableSchedule', () => {
  it('체험 ID, 연월로 계층적인 키를 생성한다', () => {
    const byActivity = reservationKeys.availableSchedule.byActivity(1);
    const byMonth = reservationKeys.availableSchedule.byMonth(1, 2026, 7);

    expect(byActivity).toEqual(['activityAvailableSchedule', 1]);
    expect(byMonth).toEqual(['activityAvailableSchedule', 1, 2026, 7]);
    expect(byMonth.slice(0, byActivity.length)).toEqual(byActivity);
  });

  it('체험이 다르면 서로 다른 키를 생성한다', () => {
    expect(reservationKeys.availableSchedule.byActivity(1)).not.toEqual(
      reservationKeys.availableSchedule.byActivity(2)
    );
  });
});

describe('reservationKeys.dashboard', () => {
  it('체험 ID, 연월로 계층적인 키를 생성한다', () => {
    const byActivity = reservationKeys.dashboard.byActivity(10);
    const byMonth = reservationKeys.dashboard.byMonth(10, 2026, 7);

    expect(byActivity).toEqual(['myActivityReservationDashboard', 10]);
    expect(byMonth).toEqual(['myActivityReservationDashboard', 10, 2026, 7]);
    expect(byMonth.slice(0, byActivity.length)).toEqual(byActivity);
  });

  it('선택된 체험이 없으면 null을 포함한 키를 생성한다', () => {
    expect(reservationKeys.dashboard.byActivity(null)).toEqual([
      'myActivityReservationDashboard',
      null,
    ]);
  });
});

describe('reservationKeys.reservedSchedule', () => {
  it('체험 ID, 날짜로 계층적인 키를 생성한다', () => {
    const byActivity = reservationKeys.reservedSchedule.byActivity(10);
    const byDate = reservationKeys.reservedSchedule.byDate(10, '2026-07-28');

    expect(byActivity).toEqual(['myActivityReservedSchedule', 10]);
    expect(byDate).toEqual(['myActivityReservedSchedule', 10, '2026-07-28']);
    expect(byDate.slice(0, byActivity.length)).toEqual(byActivity);
  });
});

describe('reservationKeys.requests', () => {
  it('체험 ID, 스케줄 ID, 상태 탭으로 계층적인 키를 생성한다', () => {
    const byActivity = reservationKeys.requests.byActivity(10);
    const bySchedule = reservationKeys.requests.bySchedule(10, 5, 'pending');

    expect(byActivity).toEqual(['myActivityReservations', 10]);
    expect(bySchedule).toEqual(['myActivityReservations', 10, 5, 'pending']);
    expect(bySchedule.slice(0, byActivity.length)).toEqual(byActivity);
  });
});

describe('예약 승인/거절/생성/취소 시 사용하는 조회 키와 무효화 키의 구조가 동일한지 검증', () => {
  it('예약 승인/거절(useReservationStatusUpdate)이 무효화하는 키는 조회에 사용한 키의 상위 키와 같다', () => {
    const activityId = 42;

    // useReservationRequests, useReservationCalendarQueries가 조회에 사용하는 키
    const requestsQueryKey = reservationKeys.requests.bySchedule(
      activityId,
      1,
      'pending'
    );
    const reservedScheduleQueryKey = reservationKeys.reservedSchedule.byDate(
      activityId,
      '2026-07-28'
    );
    const dashboardQueryKey = reservationKeys.dashboard.byMonth(
      activityId,
      2026,
      7
    );

    // useReservationStatusUpdate, useAutoDeclineExpiredReservations가 무효화에 사용하는 키
    const requestsInvalidateKey =
      reservationKeys.requests.byActivity(activityId);
    const reservedScheduleInvalidateKey =
      reservationKeys.reservedSchedule.byActivity(activityId);
    const dashboardInvalidateKey =
      reservationKeys.dashboard.byActivity(activityId);

    expect(requestsQueryKey.slice(0, requestsInvalidateKey.length)).toEqual(
      requestsInvalidateKey
    );
    expect(
      reservedScheduleQueryKey.slice(0, reservedScheduleInvalidateKey.length)
    ).toEqual(reservedScheduleInvalidateKey);
    expect(dashboardQueryKey.slice(0, dashboardInvalidateKey.length)).toEqual(
      dashboardInvalidateKey
    );
  });

  it('예약 취소/리뷰 작성이 무효화하는 키는 내 예약 목록 조회 키의 상위 키와 같다', () => {
    const listQueryKey = reservationKeys.myReservations.list('confirmed');
    const invalidateKey = reservationKeys.myReservations.all;

    expect(listQueryKey.slice(0, invalidateKey.length)).toEqual(invalidateKey);
  });

  it('예약 생성이 무효화하는 키는 예약 가능 시간 조회 키의 상위 키와 같다', () => {
    const queryKey = reservationKeys.availableSchedule.byMonth(1, 2026, 7);
    const invalidateKey = reservationKeys.availableSchedule.byActivity(1);

    expect(queryKey.slice(0, invalidateKey.length)).toEqual(invalidateKey);
  });
});

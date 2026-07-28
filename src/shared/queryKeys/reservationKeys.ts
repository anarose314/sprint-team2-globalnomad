/**
 * 예약 도메인 TanStack Query Key Factory
 *
 * 상위(all) → 목록/체험 단위 → 상세 단위로 키 계층을 유지해, 조회에 사용한 키와
 * 캐시 무효화(invalidate)에 사용한 키가 항상 같은 구조를 공유하도록 한다.
 * 인자를 타입으로 제한해 다른 값 타입이 섞여 다른 캐시 키가 생성되는 것을 방지한다.
 */
export const reservationKeys = {
  /** 마이페이지 > 내 예약 내역 목록 */
  myReservations: {
    all: ['myReservations'] as const,
    list: (status: string | null = null) =>
      [...reservationKeys.myReservations.all, status] as const,
    /** 체험 예약 카드에서 이미 예약한 스케줄을 가리기 위해 조회하는 내 예약 스케줄 목록 */
    reservedSchedules: () =>
      [...reservationKeys.myReservations.all, 'reservedSchedules'] as const,
  },
  /** 체험 상세 > 예약 가능 시간 (연월 단위) */
  availableSchedule: {
    all: ['activityAvailableSchedule'] as const,
    byActivity: (activityId: number) =>
      [...reservationKeys.availableSchedule.all, activityId] as const,
    byMonth: (activityId: number, year: number, month: number) =>
      [
        ...reservationKeys.availableSchedule.byActivity(activityId),
        year,
        month,
      ] as const,
  },
  /** 호스트 예약 대시보드 > 월별 예약 현황 집계 */
  dashboard: {
    all: ['myActivityReservationDashboard'] as const,
    byActivity: (activityId: number | null) =>
      [...reservationKeys.dashboard.all, activityId] as const,
    byMonth: (activityId: number | null, year: number, month: number) =>
      [
        ...reservationKeys.dashboard.byActivity(activityId),
        year,
        month,
      ] as const,
  },
  /** 호스트 예약 대시보드 > 날짜별 예약 스케줄 */
  reservedSchedule: {
    all: ['myActivityReservedSchedule'] as const,
    byActivity: (activityId: number | null) =>
      [...reservationKeys.reservedSchedule.all, activityId] as const,
    byDate: (activityId: number | null, dateKey: string | null) =>
      [
        ...reservationKeys.reservedSchedule.byActivity(activityId),
        dateKey,
      ] as const,
  },
  /** 호스트 예약 대시보드 > 선택 시간대 예약 신청자 목록 */
  requests: {
    all: ['myActivityReservations'] as const,
    byActivity: (activityId: number | null) =>
      [...reservationKeys.requests.all, activityId] as const,
    bySchedule: (
      activityId: number | null,
      scheduleId: number | null,
      status: string
    ) =>
      [
        ...reservationKeys.requests.byActivity(activityId),
        scheduleId,
        status,
      ] as const,
  },
} as const;

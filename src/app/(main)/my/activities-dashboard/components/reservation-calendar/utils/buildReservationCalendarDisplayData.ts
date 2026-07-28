import type {
  ReservationCalendarDateDisplayState,
  ReservationCalendarDisplayByDate,
  ReservationEventCounts,
} from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservationCalendar.types';
import { mergeScheduleOverlayIntoEventCounts } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/utils/mergeScheduleOverlayIntoEventCounts';
import type { ReservationDashboardDailyItem } from '@/shared/types/reservationDashboard.types';
import type { ReservedScheduleItem } from '@/shared/types/reservedSchedule.types';

export interface BuildReservationCalendarDisplayDataParams {
  reservationDashboard: ReservationDashboardDailyItem[];
  reservedScheduleDateKey: string | null;
  reservedSchedulesSelected: ReservedScheduleItem[];
  reservedSchedulesToday: ReservedScheduleItem[];
  isTodayScheduleFetchRequired: boolean;
  todayDateKey: string;
  /** 지난 날짜/스케줄 종료 여부 판단 기준 시각 */
  now: Date;
}

export interface ReservationCalendarDisplayResult {
  eventCountsByDate: Record<string, ReservationEventCounts>;
  notificationDotByDate: Record<string, boolean>;
}

const hasReservedSlotActivity = (schedules: ReservedScheduleItem[]) =>
  schedules.some((schedule) => {
    const pending = Math.max(schedule.count.pending, 0);
    const confirmed = Math.max(schedule.count.confirmed, 0);
    const declined = Math.max(schedule.count.declined, 0);
    return pending + confirmed + declined > 0;
  });

/**
 * 대시보드 일간 응답 하나를 화면 표시 상태로 보정하는 순수 함수.
 * - 지난 날짜는 대기(pending)를 숨기고, 승인(confirmed)은 완료(completed)로 넘긴다.
 * - 거절(declined)을 포함해 값이 하나라도 있으면 알림 도트를 켠다(배지에는 표시하지 않는다).
 */
const buildDailyDisplayStateFromDashboardItem = (
  item: ReservationDashboardDailyItem,
  todayDateKey: string
): ReservationCalendarDateDisplayState => {
  const r = item.reservations;
  const completed = Math.max(r.completed ?? 0, 0);
  const confirmed = Math.max(r.confirmed ?? 0, 0);
  const pending = Math.max(r.pending ?? 0, 0);
  const declined = Math.max(r.declined ?? 0, 0);
  const isPastDate = item.date < todayDateKey;
  const pendingForDisplay = isPastDate ? 0 : pending;
  const rawTotal = pendingForDisplay + confirmed + completed + declined;

  const shiftedConfirmed = isPastDate ? 0 : confirmed;
  const shiftedCompleted = isPastDate ? completed + confirmed : completed;

  const eventCounts: ReservationEventCounts = {};
  if (pendingForDisplay > 0) eventCounts.pending = pendingForDisplay;
  if (shiftedConfirmed > 0) eventCounts.confirmed = shiftedConfirmed;
  if (shiftedCompleted > 0) eventCounts.completed = shiftedCompleted;

  return { eventCounts, hasNotificationDot: rawTotal > 0 };
};

/**
 * 월간 대시보드 응답 전체를 날짜별 표시 상태 맵으로 변환한다.
 */
const buildDisplayByDateFromDashboard = (
  reservationDashboard: ReservationDashboardDailyItem[],
  todayDateKey: string
): ReservationCalendarDisplayByDate =>
  reservationDashboard.reduce<ReservationCalendarDisplayByDate>(
    (accumulator, item) => {
      accumulator[item.date] = buildDailyDisplayStateFromDashboardItem(
        item,
        todayDateKey
      );
      return accumulator;
    },
    {}
  );

/**
 * 선택 날짜와 오늘 날짜의 reserved-schedule 응답을 하나의 날짜별 맵으로 합친다.
 * 오늘이 선택 날짜와 같으면 같은 날짜를 중복 반영하지 않도록 선택 날짜 쪽만 사용한다.
 */
const buildReservedScheduleByDate = ({
  reservedScheduleDateKey,
  reservedSchedulesSelected,
  reservedSchedulesToday,
  isTodayScheduleFetchRequired,
  todayDateKey,
}: Pick<
  BuildReservationCalendarDisplayDataParams,
  | 'reservedScheduleDateKey'
  | 'reservedSchedulesSelected'
  | 'reservedSchedulesToday'
  | 'isTodayScheduleFetchRequired'
  | 'todayDateKey'
>): Map<string, ReservedScheduleItem[]> => {
  const reservedScheduleByDate = new Map<string, ReservedScheduleItem[]>();

  if (reservedScheduleDateKey && reservedSchedulesSelected.length > 0) {
    reservedScheduleByDate.set(
      reservedScheduleDateKey,
      reservedSchedulesSelected
    );
  }

  if (
    isTodayScheduleFetchRequired &&
    reservedSchedulesToday.length > 0 &&
    todayDateKey !== reservedScheduleDateKey
  ) {
    reservedScheduleByDate.set(todayDateKey, reservedSchedulesToday);
  }

  return reservedScheduleByDate;
};

/**
 * 대시보드 응답, 선택 날짜/오늘 날짜의 reserved-schedule 응답을 입력받아
 * 캘린더 날짜별 표시 상태(배지 집계, 알림 도트)를 계산하는 순수 함수.
 *
 * 1. 대시보드 응답을 날짜별 표시 상태로 변환한다.
 * 2. 선택/오늘 날짜에 예약 활동이 있으면 알림 도트를 켠다(대시보드에 없는 날짜도 포함).
 * 3. 선택/오늘 날짜의 reserved-schedule 응답으로 배지 집계를 스케줄 단위로 보정한다.
 */
export const buildReservationCalendarDisplayData = ({
  reservationDashboard,
  reservedScheduleDateKey,
  reservedSchedulesSelected,
  reservedSchedulesToday,
  isTodayScheduleFetchRequired,
  todayDateKey,
  now,
}: BuildReservationCalendarDisplayDataParams): ReservationCalendarDisplayResult => {
  const displayByDate = buildDisplayByDateFromDashboard(
    reservationDashboard,
    todayDateKey
  );

  if (
    reservedScheduleDateKey &&
    hasReservedSlotActivity(reservedSchedulesSelected)
  ) {
    displayByDate[reservedScheduleDateKey] = {
      eventCounts: displayByDate[reservedScheduleDateKey]?.eventCounts ?? {},
      hasNotificationDot: true,
    };
  }

  if (
    isTodayScheduleFetchRequired &&
    hasReservedSlotActivity(reservedSchedulesToday)
  ) {
    displayByDate[todayDateKey] = {
      eventCounts: displayByDate[todayDateKey]?.eventCounts ?? {},
      hasNotificationDot: true,
    };
  }

  const reservedScheduleByDate = buildReservedScheduleByDate({
    reservedScheduleDateKey,
    reservedSchedulesSelected,
    reservedSchedulesToday,
    isTodayScheduleFetchRequired,
    todayDateKey,
  });

  reservedScheduleByDate.forEach((schedules, dateKey) => {
    const merged = mergeScheduleOverlayIntoEventCounts(
      dateKey,
      schedules,
      now,
      displayByDate[dateKey]?.eventCounts
    );
    if (merged) {
      displayByDate[dateKey] = {
        eventCounts: merged,
        hasNotificationDot: displayByDate[dateKey]?.hasNotificationDot ?? false,
      };
    }
  });

  const eventCountsByDate: Record<string, ReservationEventCounts> = {};
  const notificationDotByDate: Record<string, boolean> = {};

  Object.entries(displayByDate).forEach(([dateKey, state]) => {
    if (Object.keys(state.eventCounts).length > 0) {
      eventCountsByDate[dateKey] = state.eventCounts;
    }
    if (state.hasNotificationDot) {
      notificationDotByDate[dateKey] = true;
    }
  });

  return { eventCountsByDate, notificationDotByDate };
};

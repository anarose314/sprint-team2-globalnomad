import type {
  TimeSlotAvailability,
  TimeSlotWithStatus,
} from '@/app/(main)/activity/[id]/components/activity-reservation-card/activityReservationCard.types';
import {
  isUpcomingTimeSlot,
  normalizeDateKey,
} from '@/app/(main)/activity/[id]/components/activity-reservation-card/utils/reservationDateTime';
import type {
  ActivityAvailableScheduleItem,
  ActivitySchedule,
} from '@/shared/types/activityDetail.types';

/**
 * 예약 가능 시간 조회(API) 상태.
 * loading/error 시에는 원본 시간대를 예약 가능으로 활성화하지 않고 `unavailable`로 표시한다.
 */
export type AvailableScheduleQueryStatus = 'loading' | 'error' | 'success';
export type AvailableScheduleQueryStatusByMonth = Record<
  string,
  AvailableScheduleQueryStatus
>;

export interface BuildReservationAvailabilityParams {
  /** 체험 상세에 포함된 원본 스케줄(표시할 시간대의 기준) */
  schedules: ActivitySchedule[];
  /** 월별 예약 가능 시간 조회 API 응답을 합친 목록 */
  availableSchedules: ActivityAvailableScheduleItem[];
  /** 예약 가능 시간 조회 API의 연월(`YYYY-MM`)별 상태 */
  availableScheduleQueryStatusByMonth: AvailableScheduleQueryStatusByMonth;
  /** 이미 내가 예약한(또는 이번 세션에 예약 완료한) 스케줄 ID */
  myScheduleIds: number[];
  /** 내 예약 목록 조회 상태(비로그인 사용자는 `success`) */
  myScheduleQueryStatus: AvailableScheduleQueryStatus;
  /** 지난 시간 판단 기준 시각 */
  now: Date;
}

export interface ReservationAvailabilityResult {
  /** 날짜(`YYYY-MM-DD`)별 시간대 목록. 오늘 이전 날짜는 제외한다. */
  scheduleByDate: Record<string, TimeSlotWithStatus[]>;
}

const buildAvailableScheduleIdSet = (
  availableSchedules: ActivityAvailableScheduleItem[]
) => {
  const ids = new Set<number>();
  availableSchedules.forEach((item) => {
    item.times.forEach((time) => ids.add(time.id));
  });
  return ids;
};

const resolveTimeSlotStatus = ({
  scheduleId,
  isUpcoming,
  myScheduleIdSet,
  myScheduleQueryStatus,
  availableScheduleIdSet,
  availableScheduleQueryStatus,
}: {
  scheduleId: number;
  isUpcoming: boolean;
  myScheduleIdSet: Set<number>;
  myScheduleQueryStatus: AvailableScheduleQueryStatus;
  availableScheduleIdSet: Set<number>;
  availableScheduleQueryStatus: AvailableScheduleQueryStatus;
}): TimeSlotAvailability => {
  if (myScheduleIdSet.has(scheduleId)) {
    return 'mine';
  }

  if (!isUpcoming) {
    return 'unavailable';
  }

  if (myScheduleQueryStatus !== 'success') {
    return 'unavailable';
  }

  if (availableScheduleQueryStatus !== 'success') {
    return 'unavailable';
  }

  return availableScheduleIdSet.has(scheduleId) ? 'available' : 'unavailable';
};

/**
 * 원본 스케줄을 기준으로 날짜별 시간대 목록을 만들고, 예약 가능 시간 API 응답·내 예약 목록·
 * 조회 상태·현재 시각을 조합해 각 시간대의 상태(`available`/`mine`/`unavailable`)를 계산하는 순수 함수.
 *
 * - 오늘 이전 날짜는 결과에서 완전히 제외한다(달력에서 선택 불가).
 * - 오늘 날짜에 속한 시간대는 시작 시간이 지났더라도 표시하되, 지난 시간대는 `unavailable`로
 *   처리해 선택할 수 없게 한다(내 예약이면 지난 시간대여도 `mine`을 유지한다).
 * - 해당 연월의 조회가 loading/error이면 그 연월의 원본 시간대를 예약 가능으로 활성화하지 않는다.
 * - 로그인 사용자의 내 예약 조회가 끝나지 않았거나 실패하면 중복 예약 방지를 위해 시간대를 활성화하지 않는다.
 */
export const buildReservationAvailability = ({
  schedules,
  availableSchedules,
  availableScheduleQueryStatusByMonth,
  myScheduleIds,
  myScheduleQueryStatus,
  now,
}: BuildReservationAvailabilityParams): ReservationAvailabilityResult => {
  const myScheduleIdSet = new Set(myScheduleIds);
  const availableScheduleIdSet =
    buildAvailableScheduleIdSet(availableSchedules);
  const todayKey = normalizeDateKey(now);

  const scheduleByDate = schedules.reduce<Record<string, TimeSlotWithStatus[]>>(
    (accumulator, schedule) => {
      const dateKey = normalizeDateKey(schedule.date);
      if (dateKey < todayKey) {
        return accumulator;
      }

      const yearMonthKey = dateKey.slice(0, 7);
      const availableScheduleQueryStatus =
        availableScheduleQueryStatusByMonth[yearMonthKey] ?? 'loading';

      const status = resolveTimeSlotStatus({
        scheduleId: schedule.id,
        isUpcoming: isUpcomingTimeSlot(dateKey, schedule.startTime, now),
        myScheduleIdSet,
        myScheduleQueryStatus,
        availableScheduleIdSet,
        availableScheduleQueryStatus,
      });

      const nextSlot: TimeSlotWithStatus = {
        id: schedule.id,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        status,
      };

      if (!accumulator[dateKey]) {
        accumulator[dateKey] = [nextSlot];
      } else {
        accumulator[dateKey].push(nextSlot);
      }

      return accumulator;
    },
    {}
  );

  return { scheduleByDate };
};

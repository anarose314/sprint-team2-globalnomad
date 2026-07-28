import type { TimeSlot } from '@/app/(main)/activity/[id]/components/activity-reservation-card/activityReservationCard.types';
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
 * loading/error 시에는 원본 스케줄(schedules)을 대체 데이터로 사용한다.
 */
export type AvailableScheduleQueryStatus = 'loading' | 'error' | 'success';

export interface BuildReservationAvailabilityParams {
  /** 체험 상세에 포함된 원본 스케줄(대체 데이터 원천) */
  schedules: ActivitySchedule[];
  /** 월별 예약 가능 시간 조회 API 응답을 합친 목록 */
  availableSchedules: ActivityAvailableScheduleItem[];
  /** 예약 가능 시간 조회 API의 상태 */
  availableScheduleQueryStatus: AvailableScheduleQueryStatus;
  /** 이미 예약이 완료되어 선택 불가능한 스케줄 ID */
  blockedScheduleIds: number[];
  /** 지난 시간 판단 기준 시각 */
  now: Date;
}

export interface ReservationAvailabilityResult {
  /** 날짜(`YYYY-MM-DD`)별 예약 가능 시간대 */
  availableScheduleByDate: Record<string, TimeSlot[]>;
  /** true면 API 응답 대신 원본 스케줄을 대체 데이터로 사용 중임을 의미한다. */
  usesFallbackSchedule: boolean;
}

const buildScheduleByDateFromSchedules = (
  schedules: ActivitySchedule[],
  blockedScheduleIds: number[],
  now: Date
) => {
  return schedules.reduce<Record<string, TimeSlot[]>>(
    (accumulator, schedule) => {
      if (blockedScheduleIds.includes(schedule.id)) {
        return accumulator;
      }

      const dateKey = normalizeDateKey(schedule.date);
      if (!isUpcomingTimeSlot(dateKey, schedule.startTime, now)) {
        return accumulator;
      }

      const nextSlot: TimeSlot = {
        id: schedule.id,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
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
};

const buildScheduleByDateFromAvailableSchedules = (
  availableSchedules: ActivityAvailableScheduleItem[],
  blockedScheduleIds: number[],
  now: Date
) => {
  return availableSchedules.reduce<Record<string, TimeSlot[]>>(
    (accumulator, item) => {
      const dateKey = normalizeDateKey(item.date);
      const filteredTimes = item.times.filter(
        (time) =>
          !blockedScheduleIds.includes(time.id) &&
          isUpcomingTimeSlot(dateKey, time.startTime, now)
      );

      if (filteredTimes.length === 0) {
        return accumulator;
      }

      accumulator[dateKey] = filteredTimes.map((time) => ({
        id: time.id,
        startTime: time.startTime,
        endTime: time.endTime,
      }));

      return accumulator;
    },
    {}
  );
};

/**
 * 원본 스케줄, 예약 가능 시간 API 응답, 조회 상태, 예약 완료 스케줄 ID, 현재 시각을 입력받아
 * 화면에 표시할 날짜별 예약 가능 시간대를 계산하는 순수 함수.
 *
 * - loading/error 이거나 API 응답이 정상이지만 결과가 비어 있으면 원본 스케줄을 대체 데이터로 사용한다.
 * - 지난 시간과 이미 예약이 완료된(blockedScheduleIds) 시간대는 결과에서 제외한다.
 */
export const buildReservationAvailability = ({
  schedules,
  availableSchedules,
  availableScheduleQueryStatus,
  blockedScheduleIds,
  now,
}: BuildReservationAvailabilityParams): ReservationAvailabilityResult => {
  const fromAvailableApi = buildScheduleByDateFromAvailableSchedules(
    availableSchedules,
    blockedScheduleIds,
    now
  );

  const shouldUseFallback =
    availableScheduleQueryStatus !== 'success' ||
    Object.keys(fromAvailableApi).length === 0;

  if (shouldUseFallback) {
    return {
      availableScheduleByDate: buildScheduleByDateFromSchedules(
        schedules,
        blockedScheduleIds,
        now
      ),
      usesFallbackSchedule: true,
    };
  }

  return {
    availableScheduleByDate: fromAvailableApi,
    usesFallbackSchedule: false,
  };
};

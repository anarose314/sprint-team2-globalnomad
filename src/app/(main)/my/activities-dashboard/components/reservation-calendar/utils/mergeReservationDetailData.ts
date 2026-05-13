import { ActivityScheduleItem } from '@/app/(main)/my/activities-dashboard/apis/activitySchedules';
import { ReservationDetailData } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservationCalendar.types';
import { ReservedScheduleItem } from '@/shared/types/reservedSchedule.types';

const EMPTY_RESERVATION_COUNT = {
  pending: 0,
  confirmed: 0,
  declined: 0,
};

interface BuildReservationDetailDataProps {
  activitySchedules: ActivityScheduleItem[];
  reservedSchedules: ReservedScheduleItem[];
  reservedScheduleDateKey: string | null;
}

/**
 * 체험 스케줄/예약 스케줄을 병합해 상세 패널 시간 슬롯 데이터를 생성한다.
 */
export const buildReservationDetailData = ({
  activitySchedules,
  reservedSchedules,
  reservedScheduleDateKey,
}: BuildReservationDetailDataProps): ReservationDetailData => {
  const filteredActivitySchedules = reservedScheduleDateKey
    ? activitySchedules.filter(
        (schedule) => schedule.date === reservedScheduleDateKey
      )
    : [];

  const reservedByScheduleId = new Map(
    reservedSchedules.map(
      (schedule) => [schedule.scheduleId, schedule] as const
    )
  );
  const consumedReservedScheduleIds = new Set<number>();

  const mergedTimeSlots = filteredActivitySchedules
    .map((schedule) => {
      const reservedSchedule =
        schedule.scheduleId !== null
          ? reservedByScheduleId.get(schedule.scheduleId)
          : undefined;

      if (reservedSchedule) {
        consumedReservedScheduleIds.add(reservedSchedule.scheduleId);
      }

      const resolvedScheduleId =
        schedule.scheduleId ?? reservedSchedule?.scheduleId ?? null;

      return {
        scheduleId: resolvedScheduleId,
        label: `${schedule.startTime} - ${schedule.endTime}`,
        value:
          resolvedScheduleId !== null
            ? String(resolvedScheduleId)
            : `${schedule.startTime}-${schedule.endTime}`,
        count: reservedSchedule?.count ?? EMPTY_RESERVATION_COUNT,
        sortKey: schedule.startTime,
      };
    })
    .concat(
      reservedSchedules
        .filter(
          (schedule) => !consumedReservedScheduleIds.has(schedule.scheduleId)
        )
        .map((schedule) => ({
          scheduleId: schedule.scheduleId,
          label: `${schedule.startTime} - ${schedule.endTime}`,
          value: String(schedule.scheduleId),
          count: schedule.count,
          sortKey: schedule.startTime,
        }))
    )
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .map(({ sortKey: _sortKey, ...timeSlot }) => timeSlot);

  return {
    timeSlots: mergedTimeSlots,
  };
};

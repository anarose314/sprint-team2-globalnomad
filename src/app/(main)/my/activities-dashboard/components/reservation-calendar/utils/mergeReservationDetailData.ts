import { ReservationDetailData } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservationCalendar.types';
import { ReservedScheduleItem } from '@/shared/types/reservedSchedule.types';

interface BuildReservationDetailDataProps {
  reservedSchedules: ReservedScheduleItem[];
}

/**
 * 예약이 존재하는 스케줄만 상세 패널 시간 슬롯으로 변환
 */
export const buildReservationDetailData = ({
  reservedSchedules,
}: BuildReservationDetailDataProps): ReservationDetailData => {
  const reservationTimeSlots = reservedSchedules
    .filter((schedule) => {
      const pending = Math.max(schedule.count.pending, 0);
      const confirmed = Math.max(schedule.count.confirmed, 0);
      const declined = Math.max(schedule.count.declined, 0);
      return pending + confirmed + declined > 0;
    })
    .map((schedule) => ({
      scheduleId: schedule.scheduleId,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      label: `${schedule.startTime} - ${schedule.endTime}`,
      value: String(schedule.scheduleId),
      count: schedule.count,
      sortKey: schedule.startTime,
    }))
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .map(({ sortKey: _sortKey, ...timeSlot }) => timeSlot);

  return {
    timeSlots: reservationTimeSlots,
  };
};

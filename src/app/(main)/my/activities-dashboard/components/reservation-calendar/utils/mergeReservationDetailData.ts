import { ReservationDetailData } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservationCalendar.types';
import { ReservedScheduleItem } from '@/shared/types/reservedSchedule.types';

interface BuildReservationDetailDataProps {
  reservedSchedules: ReservedScheduleItem[];
}

/**
 * 예약 상태가 존재하는 시간 슬롯만 상세 패널용 데이터로 변환
 *
 * 노출 대상:
 * - pending / confirmed / declined 중 하나라도 1 이상
 * - completed는 서버 상태 전환 값으로 사용하지 않고, UI에서 시간 경과 시 뱃지로만 처리
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
      count: {
        pending: Math.max(schedule.count.pending, 0),
        confirmed: Math.max(schedule.count.confirmed, 0),
        declined: Math.max(schedule.count.declined, 0),
      },
      sortKey: schedule.startTime,
    }))
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .map(({ sortKey: _sortKey, ...timeSlot }) => timeSlot);

  return {
    timeSlots: reservationTimeSlots,
  };
};

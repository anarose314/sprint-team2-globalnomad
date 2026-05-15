import { ReservationDetailData } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservationCalendar.types';
import { ReservedScheduleItem } from '@/shared/types/reservedSchedule.types';

interface BuildReservationDetailDataProps {
  reservedSchedules: ReservedScheduleItem[];
}

/**
 * 예약 상태가 존재하는 시간 슬롯만 상세 패널용 데이터로 변환
 *
 * 노출 대상:
 * - pending / confirmed / declined / completed 중 하나라도 1 이상
 * - completed는 서버 집계이며, 상세 패널 슬롯 노출·승인 탭 목록 조회에 반영한다.
 */
export const buildReservationDetailData = ({
  reservedSchedules,
}: BuildReservationDetailDataProps): ReservationDetailData => {
  const reservationTimeSlots = reservedSchedules
    .filter((schedule) => {
      const pending = Math.max(schedule.count.pending, 0);
      const confirmed = Math.max(schedule.count.confirmed, 0);
      const declined = Math.max(schedule.count.declined, 0);
      const completed = Math.max(schedule.count.completed ?? 0, 0);
      return pending + confirmed + declined + completed > 0;
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
        completed: Math.max(schedule.count.completed ?? 0, 0),
      },
      sortKey: schedule.startTime,
    }))
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .map(({ sortKey: _sortKey, ...timeSlot }) => timeSlot);

  return {
    timeSlots: reservationTimeSlots,
  };
};

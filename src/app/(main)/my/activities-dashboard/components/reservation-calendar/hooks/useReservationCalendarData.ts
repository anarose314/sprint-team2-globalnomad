import { useMemo } from 'react';
import { useAutoDeclineExpiredReservations } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/hooks/useAutoDeclineExpiredReservations';
import { useReservationCalendarDisplayData } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/hooks/useReservationCalendarDisplayData';
import { useReservationCalendarQueries } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/hooks/useReservationCalendarQueries';
import { formatDateKey } from '@/shared/utils/formatDate';

interface UseReservationCalendarDataProps {
  activityId: number | null;
  currentYear: number;
  currentMonth: number;
  reservedScheduleDateKey: string | null;
}

/**
 * 예약 캘린더 화면에서 필요한 조회 데이터를 한 번에 조합
 *
 * 월간 reservation-dashboard로 달력 배지·알림 도트를 구성
 * URL로 연 선택일,현재 보이는 달에 포함된 오늘 날짜에 대해 reserved-schedule을 조회해 배지 집계를 스케줄 단위로 보정
 * (오늘만 선택하지 않아도 지난 슬롯의 pending이 대시보드에 남는 문제를 막기 위함)
 * 대시보드에 없는 날을 URL로만 열었을 때의 도트는 선택일 스케줄 응답으로만 보강
 *
 * 선택한 날짜의 스케줄을 조회한 뒤 체험 시작 시각이 지난 슬롯의 대기(pending) 예약을 클라이언트에서 자동 거절
 * 범위가 선택일로 한정되므로 장기적으로는 서버(Cron·배치·조회 시 정리 등)에서 처리하는 편이 안전
 *
 * 무효화(invalidate)로 `reservedSchedules`가 다시 불리면 이 effect가 재실행될 수 있음
 * 서버 반영 지연 등으로 pending이 남아 있으면 동일 스케줄에 대한 거절을 반복 호출할 위험이 있어 스케줄 ID별로 한 번만 시도
 */
export const useReservationCalendarData = ({
  activityId,
  currentYear,
  currentMonth,
  reservedScheduleDateKey,
}: UseReservationCalendarDataProps) => {
  const todayDateKey = formatDateKey(new Date());
  const isTodayInVisibleMonth = useMemo(() => {
    const now = new Date();
    return (
      now.getFullYear() === currentYear && now.getMonth() + 1 === currentMonth
    );
  }, [currentYear, currentMonth]);

  const fetchTodayScheduleInBackground =
    isTodayInVisibleMonth &&
    (reservedScheduleDateKey === null ||
      reservedScheduleDateKey !== todayDateKey);

  const {
    reservationDashboard,
    reservedSchedulesSelected,
    reservedSchedulesToday,
  } = useReservationCalendarQueries({
    activityId,
    currentYear,
    currentMonth,
    reservedScheduleDateKey,
    todayDateKey,
    fetchTodayScheduleInBackground,
  });

  useAutoDeclineExpiredReservations({
    activityId,
    reservedScheduleDateKey,
    todayDateKey,
    fetchTodayScheduleInBackground,
    reservedSchedulesSelected,
    reservedSchedulesToday,
  });

  const { eventCountsByDate, notificationDotByDate, detailData } =
    useReservationCalendarDisplayData({
      reservationDashboard,
      reservedScheduleDateKey,
      reservedSchedulesSelected,
      reservedSchedulesToday,
      fetchTodayScheduleInBackground,
      todayDateKey,
    });

  return {
    detailData,
    eventCountsByDate,
    notificationDotByDate,
  };
};

'use client';

import dynamic from 'next/dynamic';
import { ActivitiesDashboardSkeleton } from '@/app/(main)/my/activities-dashboard/components/activities-dashboard-skeleton';

interface ReservationCalendarClientProps {
  activityId: number | null;
}

const ReservationCalendar = dynamic(
  () =>
    import('@/app/(main)/my/activities-dashboard/components/reservation-calendar').then(
      (module) => module.ReservationCalendar
    ),
  {
    ssr: false,
    loading: () => <ActivitiesDashboardSkeleton scope="calendar" />,
  }
);

/**
 * `react-calendar` 클라이언트 전용 의존성을 안전하게 분리한 래퍼 컴포넌트
 *
 * SSR을 비활성화하고, 로딩 중에는 스켈레톤 UI를 노출
 */
export function ReservationCalendarClient({
  activityId,
}: ReservationCalendarClientProps) {
  return <ReservationCalendar activityId={activityId} />;
}

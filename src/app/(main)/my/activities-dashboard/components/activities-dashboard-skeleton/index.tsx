import { Skeleton } from '@/shared/components/skeleton';
import '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservation-calendar.css';

interface ActivitiesDashboardSkeletonProps {
  /**
   * `full`: 드롭다운 + 캘린더 영역
   * `calendar`: 캘린더 카드만 (`ReservationCalendar` 청크 로딩용)
   */
  scope?: 'full' | 'calendar';
}

function ReservationCalendarCardSkeleton() {
  return (
    <div className="mt-7 w-full md:mt-6" aria-hidden="true">
      <div className="reservation-status-calendar min-h-192 pt-6 pb-6 md:min-h-194.25 md:px-5 md:pt-6 md:pb-5.75">
        <div className="flex h-11 items-center justify-between">
          <Skeleton height={24} width={24} rounded="md" variant="shimmer" />
          <Skeleton
            height={22}
            className="mx-4 w-40 md:w-48"
            variant="shimmer"
          />
          <Skeleton height={24} width={24} rounded="md" variant="shimmer" />
        </div>

        <div className="mt-7.5 grid h-11 grid-cols-7 items-center gap-1 border-b border-gray-50 md:h-13.75">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton
              key={i}
              height={14}
              className="mx-auto w-7"
              rounded="sm"
              variant="shimmer"
            />
          ))}
        </div>

        <Skeleton
          fullWidth
          className="mt-2 min-h-39 rounded-2xl md:mt-3 md:min-h-45"
          variant="shimmer"
        />
      </div>
    </div>
  );
}

/**
 * 예약 현황 로딩 UI
 *
 * 공통 컴포넌트 `Skeleton` (`@/shared/components/skeleton`)만 조합
 * 커스텀 `animate-pulse`·단색 `div` 플레이스홀더는 사용x
 */
export function ActivitiesDashboardSkeleton({
  scope = 'full',
}: ActivitiesDashboardSkeletonProps) {
  if (scope === 'calendar') {
    return <ReservationCalendarCardSkeleton />;
  }

  return (
    <div aria-hidden="true">
      <Skeleton
        fullWidth
        className="shadow-custom mt-6 h-14 rounded-2xl 2xl:mt-7.5"
        variant="shimmer"
      />
      <ReservationCalendarCardSkeleton />
    </div>
  );
}

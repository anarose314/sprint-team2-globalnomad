'use client';

import { useEffect, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
<<<<<<< HEAD
import { fetchMyActivitiesForDashboard } from '@/app/(main)/my/activities-dashboard/apis/myActivitiesDashboard';
=======
import { fetchAllMyActivitiesForDashboard } from '@/app/(main)/my/activities-dashboard/apis/myActivitiesDashboard';
>>>>>>> e124db3 (✨ Feat: 월별 예약 API연동 및 이벤트 뱃지 상태관리)
import { ReservationCalendarClient } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservationCalendarClient';
import { Dropdown } from '@/shared/components/dropdown';
import { DropdownOption } from '@/shared/components/dropdown/dropdown.types';
import { QUERY_KEYS } from '@/shared/constants/queryKeys.constants';

/**
 * 예약 현황 페이지의 체험 선택 / 캘린더 영역 렌더링
 *
 * URL 쿼리의 `activityId`를 단일 선택 상태로 사용하며,
 * 유효하지 않은 값은 첫 번째 체험 ID로 보정
 */
export function MyActivitiesDashboardContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: activities = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.MY_ACTIVITIES_DASHBOARD,
<<<<<<< HEAD
    queryFn: fetchMyActivitiesForDashboard,
=======
    queryFn: fetchAllMyActivitiesForDashboard,
>>>>>>> e124db3 (✨ Feat: 월별 예약 API연동 및 이벤트 뱃지 상태관리)
  });

  const activityOptions = useMemo<DropdownOption[]>(
    () =>
      activities.map((activity) => ({
        label: activity.title,
        value: String(activity.id),
      })),
    [activities]
  );

  const activityIdFromQuery = useMemo(() => {
    const rawValue = searchParams.get('activityId');
    if (!rawValue) return null;

    const parsedValue = Number(rawValue);
    if (!Number.isInteger(parsedValue) || parsedValue <= 0) return null;

    return parsedValue;
  }, [searchParams]);

  const resolvedSelectedActivityId = useMemo(() => {
    if (!activities.length) {
      return null;
    }

    if (
      activityIdFromQuery !== null &&
      activities.some((activity) => activity.id === activityIdFromQuery)
    ) {
      return activityIdFromQuery;
    }

    return activities[0].id;
  }, [activities, activityIdFromQuery]);

  useEffect(() => {
    if (resolvedSelectedActivityId === null) return;
    if (activityIdFromQuery === resolvedSelectedActivityId) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set('activityId', String(resolvedSelectedActivityId));

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [
    activityIdFromQuery,
    pathname,
    resolvedSelectedActivityId,
    router,
    searchParams,
  ]);

  return (
    <>
      <Dropdown
        options={activityOptions}
        value={
          resolvedSelectedActivityId !== null
            ? String(resolvedSelectedActivityId)
            : ''
        }
        placeholder={
          isLoading
            ? '내 체험 목록을 불러오는 중입니다'
            : '등록한 체험이 없습니다'
        }
        disabled={isLoading || !activityOptions.length}
        className="mt-6 2xl:mt-7.5"
        triggerClassName="shadow-custom"
        onChange={(value) => {
          const nextActivityId = Number(value);
          if (!Number.isInteger(nextActivityId) || nextActivityId <= 0) return;

          const params = new URLSearchParams(searchParams.toString());
          params.set('activityId', String(nextActivityId));
          params.delete('date');

          router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        }}
      />

      <ReservationCalendarClient activityId={resolvedSelectedActivityId} />
    </>
  );
}

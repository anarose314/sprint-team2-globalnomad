'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMyActivitiesForDashboard } from '@/app/(main)/my/activities-dashboard/apis/myActivitiesDashboard';
import { ReservationCalendarClient } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservationCalendarClient';
import { Dropdown } from '@/shared/components/dropdown';
import { DropdownOption } from '@/shared/components/dropdown/dropdown.types';
import { QUERY_KEYS } from '@/shared/constants/queryKeys.constants';

export function MyActivitiesDashboardContent() {
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(
    null
  );

  const { data: activities = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.MY_ACTIVITIES_DASHBOARD,
    queryFn: fetchMyActivitiesForDashboard,
  });

  const activityOptions = useMemo<DropdownOption[]>(
    () =>
      activities.map((activity) => ({
        label: activity.title,
        value: String(activity.id),
      })),
    [activities]
  );

  const resolvedSelectedActivityId = useMemo(() => {
    if (!activities.length) {
      return null;
    }

    if (
      selectedActivityId !== null &&
      activities.some((activity) => activity.id === selectedActivityId)
    ) {
      return selectedActivityId;
    }

    return activities[0].id;
  }, [activities, selectedActivityId]);

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
        onChange={(value) => setSelectedActivityId(Number(value))}
      />

      <ReservationCalendarClient activityId={resolvedSelectedActivityId} />
    </>
  );
}

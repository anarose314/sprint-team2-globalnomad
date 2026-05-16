'use client';

import { PostActivities } from '@/app/(main)/activity/apis/activities.types';
import { ActivityForm } from '@/app/(main)/activity/components/activity-form';
import { ActivityFormValues } from '@/app/(main)/activity/components/activity-form/activityForm.schema';
import { usePostActivities } from '@/app/(main)/activity/hooks/usePostActivities';
import { isValidReserveTime } from '@/app/(main)/activity/utils/isValidReserveTime';
import { Button } from '@/shared/components/buttons';
import { useShowToast } from '@/shared/store/useToastStore';

export function ActivityAddForm() {
  const { mutate: createActivity, isPending } = usePostActivities();
  const showToast = useShowToast();

  const handleAddSubmit = (data: ActivityFormValues) => {
    const hasInvalidSchedule = data.schedules.some(
      (schedule) => !isValidReserveTime(schedule.date, schedule.startTime)
    );

    if (hasInvalidSchedule) {
      showToast({
        theme: 'error',
        message: '현재 시간으로부터 1시간 이후의 일정만 등록할 수 있습니다.',
      });
      return;
    }

    const payload: PostActivities = {
      ...data,
      schedules: data.schedules.map(({ id: _id, ...rest }) => rest),
      subImageUrls: data.subImageUrls || [],
    };

    createActivity(payload);
  };

  return (
    <ActivityForm onSubmit={handleAddSubmit}>
      <Button
        type="submit"
        size="md"
        className="mx-auto w-30"
        disabled={isPending}
      >
        {isPending ? '등록 중...' : '등록하기'}
      </Button>
    </ActivityForm>
  );
}

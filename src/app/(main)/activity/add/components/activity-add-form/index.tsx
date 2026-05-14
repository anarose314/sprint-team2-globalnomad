'use client';

import { PostActivities } from '@/app/(main)/activity/apis/activities.types';
import { ActivityForm } from '@/app/(main)/activity/components/activity-form';
import { ActivityFormValues } from '@/app/(main)/activity/components/activity-form/activityForm.schema';
import { usePostActivities } from '@/app/(main)/activity/hooks/usePostActivities';
import { Button } from '@/shared/components/buttons';

export function ActivityAddForm() {
  const { mutate: createActivity, isPending } = usePostActivities();

  const handleAddSubmit = (data: ActivityFormValues) => {
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

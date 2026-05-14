'use client';

import { getActivityUpdatePayload } from '@/app/(main)/activity/[id]/edit/utils/getActivityUpdatePayload';
import { ActivityForm } from '@/app/(main)/activity/components/activity-form';
import { ActivityFormValues } from '@/app/(main)/activity/components/activity-form/activityForm.schema';
import { useActivityDetail } from '@/app/(main)/activity/hooks/useActivityDetail';
import { usePatchActivities } from '@/app/(main)/activity/hooks/usePatchActivities';
import { Button } from '@/shared/components/buttons';

interface ActivityEditFormProps {
  activityId: number;
}

export function ActivityEditForm({ activityId }: ActivityEditFormProps) {
  const { data: activityData } = useActivityDetail(activityId);
  const { mutate: updateActivity, isPending } = usePatchActivities();

  const handleEditSubmit = (data: ActivityFormValues) => {
    if (!activityData) return;

    updateActivity(getActivityUpdatePayload(activityId, data, activityData));
  };

  const defaultSchedules = (activityData.schedules || []).map((sched) => ({
    id: String(sched.id),
    date: sched.date,
    startTime: sched.startTime,
    endTime: sched.endTime,
  }));

  const defaultValues: Partial<ActivityFormValues> = {
    title: activityData.title,
    category: activityData.category,
    description: activityData.description,
    price: activityData.price,
    address: activityData.address,
    bannerImageUrl: activityData.bannerImageUrl,
    subImageUrls: activityData.subImages?.map((img) => img.imageUrl) || [],
    schedules: defaultSchedules,
  };

  return (
    <ActivityForm defaultValues={defaultValues} onSubmit={handleEditSubmit}>
      <Button
        type="submit"
        size="md"
        className="mx-auto w-30"
        disabled={isPending}
      >
        {isPending ? '수정 중...' : '수정하기'}
      </Button>
    </ActivityForm>
  );
}

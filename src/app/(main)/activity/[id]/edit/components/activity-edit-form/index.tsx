'use client';

import { getActivityUpdatePayload } from '@/app/(main)/activity/[id]/edit/utils/getActivityUpdatePayload';
import { ActivityForm } from '@/app/(main)/activity/components/activity-form';
import { ActivityFormValues } from '@/app/(main)/activity/components/activity-form/activityForm.schema';
import { usePatchActivities } from '@/app/(main)/activity/hooks/usePatchActivities';
import { Button } from '@/shared/components/buttons';
import type { ActivityDetailResponse } from '@/shared/types/activityDetail.types';

interface ActivityEditFormProps {
  activityId: number;
  initialData: ActivityDetailResponse;
}

export function ActivityEditForm({
  activityId,
  initialData,
}: ActivityEditFormProps) {
  const { mutate: updateActivity, isPending } = usePatchActivities();

  const handleEditSubmit = (data: ActivityFormValues) => {
    updateActivity(getActivityUpdatePayload(activityId, data, initialData));
  };

  const defaultValues: Partial<ActivityFormValues> = {
    title: initialData.title,
    category: initialData.category,
    description: initialData.description,
    price: initialData.price,
    address: initialData.address,
    bannerImageUrl: initialData.bannerImageUrl,
    subImageUrls: initialData.subImages?.map((img) => img.imageUrl) || [],
    schedules: (initialData.schedules || []).map((sched) => ({
      id: String(sched.id),
      date: sched.date,
      startTime: sched.startTime,
      endTime: sched.endTime,
    })),
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

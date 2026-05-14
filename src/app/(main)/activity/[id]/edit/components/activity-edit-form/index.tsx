'use client';

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

    // [1] 서브 이미지 비교
    const originalImages = activityData.subImages || [];
    const finalImageUrls = data.subImageUrls || [];

    const subImageIdsToRemove = originalImages
      .filter((orig) => !finalImageUrls.includes(orig.imageUrl))
      .map((orig) => orig.id);

    const subImageUrlsToAdd = finalImageUrls.filter(
      (finalUrl) => !originalImages.some((orig) => orig.imageUrl === finalUrl)
    );

    // [2] 스케줄 비교
    const originalSchedules = activityData.schedules || [];
    const finalSchedules = data.schedules;

    // 최종 목록에 없는 기존 스케쥴 삭제
    const scheduleIdsToRemove = originalSchedules
      .filter(
        (orig) =>
          !finalSchedules.some((final) => String(final.id) === String(orig.id))
      )
      .map((orig) => orig.id);

    // id는 있지만 내용이 달라진 스케쥴 감지
    const modifiedSchedules = finalSchedules.filter((final) => {
      const original = originalSchedules.find(
        (orig) => String(orig.id) === String(final.id)
      );
      if (!original) return false;
      return (
        original.date !== final.date ||
        original.startTime !== final.startTime ||
        original.endTime !== final.endTime
      );
    });

    const modifiedIds = modifiedSchedules.map((s) => Number(s.id));
    const finalScheduleIdsToRemove = [...scheduleIdsToRemove, ...modifiedIds];

    const schedulesToAdd = [
      ...finalSchedules
        .filter(
          (final) =>
            !originalSchedules.some(
              (orig) => String(orig.id) === String(final.id)
            )
        )
        .map(({ id: _id, ...rest }) => rest),
      ...modifiedSchedules.map(({ id: _id, ...rest }) => rest),
    ];

    // [3] 최종 Payload 조립 및 API 호출
    const payload = {
      activityId,
      body: {
        title: data.title,
        category: data.category,
        description: data.description,
        price: data.price,
        address: data.address,
        bannerImageUrl: data.bannerImageUrl,
        subImageIdsToRemove,
        subImageUrlsToAdd,
        scheduleIdsToRemove: finalScheduleIdsToRemove,
        schedulesToAdd,
      },
    };

    updateActivity(payload);
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

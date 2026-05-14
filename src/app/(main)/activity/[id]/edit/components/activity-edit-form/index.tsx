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

    // 최적화를 위한 Map 생성
    const originalSchedulesMap = new Map(
      originalSchedules.map((s) => [String(s.id), s])
    );

    // 최종 목록에 없는 기존 스케쥴 삭제 대상 추출
    const scheduleIdsToRemove = originalSchedules
      .filter(
        (orig) =>
          !finalSchedules.some((final) => String(final.id) === String(orig.id))
      )
      .map((orig) => orig.id);

    // 내용이 변경된 스케쥴 감지
    const modifiedSchedules = finalSchedules.filter((final) => {
      const original = originalSchedulesMap.get(String(final.id));
      return (
        original &&
        (original.date !== final.date ||
          original.startTime !== final.startTime ||
          original.endTime !== final.endTime)
      );
    });

    const finalScheduleIdsToRemove = [
      ...scheduleIdsToRemove,
      ...modifiedSchedules.map((s) => Number(s.id)),
    ];

    const schedulesToAdd = [
      ...finalSchedules.filter(
        (final) => !originalSchedulesMap.has(String(final.id))
      ),
      ...modifiedSchedules,
    ].map(({ id: _id, ...rest }) => rest);

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

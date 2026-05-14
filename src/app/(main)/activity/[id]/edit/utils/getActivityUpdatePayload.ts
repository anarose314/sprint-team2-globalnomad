import { ActivityFormValues } from '@/app/(main)/activity/components/activity-form/activityForm.schema';
import { ActivityDetailResponse } from '@/shared/types/activityDetail.types';

export function getActivityUpdatePayload(
  activityId: number,
  data: ActivityFormValues,
  activityData: ActivityDetailResponse
) {
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

  // [3] 최종 Payload 조립
  return {
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
}

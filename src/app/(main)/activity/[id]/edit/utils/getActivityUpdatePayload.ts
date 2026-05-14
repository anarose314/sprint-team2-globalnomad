import { ActivityFormValues } from '@/app/(main)/activity/components/activity-form/activityForm.schema';
import { ActivityDetailResponse } from '@/shared/types/activityDetail.types';

/**
 * 체험 수정 폼 데이터를 API 요청 규격(Payload)에 맞게 변환하는 유틸 함수
 *
 * - 기존 데이터와 폼 데이터를 비교하여 추가 및 삭제할 서브 이미지와 스케줄을 분류
 * - 스케줄의 시간 변경(수정)은 기존 ID 삭제 후 새로운 스케줄로 재등록하는 방식으로 처리
 *
 * @example
 * const payload = getActivityUpdatePayload(activityId, formData, originalData);
 * updateActivity(payload);
 */
export const getActivityUpdatePayload = (
  activityId: number,
  data: ActivityFormValues,
  activityData: ActivityDetailResponse
) => {
  // [1] 서브 이미지 비교
  const originalImages = activityData.subImages || [];
  const finalImageUrls = data.subImageUrls || [];

  const finalImageUrlsSet = new Set(finalImageUrls);
  const subImageIdsToRemove = originalImages
    .filter((orig) => !finalImageUrlsSet.has(orig.imageUrl))
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
  const finalScheduleIds = new Set(finalSchedules.map((s) => String(s.id)));
  const scheduleIdsToRemove = originalSchedules
    .filter((orig) => !finalScheduleIds.has(String(orig.id)))
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
};

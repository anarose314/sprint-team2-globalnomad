'use client';

import { ActivityForm } from '@/app/(main)/activity/components/activity-form';
import { ActivityFormValues } from '@/app/(main)/activity/components/activity-form/activityForm.schema';
import { useActivityDetail } from '@/app/(main)/activity/hooks/useActivityDetail';
import { Button } from '@/shared/components/buttons';

interface ActivityEditFormProps {
  activityId: number;
}

export function ActivityEditForm({ activityId }: ActivityEditFormProps) {
  const { data: activityData, isLoading } = useActivityDetail(activityId);

  const handleEditSubmit = (data: ActivityFormValues) => {
    // TODO: 수정 API 호출
    console.log('수정 제출 데이터:', data);
  };

  // TODO: 로딩 화면 출력
  if (isLoading) return <div>데이터를 불러오는 중입니다...</div>;
  // TODO: 에러 화면 출력
  if (!activityData) return <div>데이터를 찾을 수 없습니다.</div>;

  const defaultSchedules = (activityData.schedules || []).map((sched) => ({
    id: String(sched.id),
    date: sched.date,
    startTime: sched.startTime,
    endTime: sched.endTime,
  }));

  const defaultValues: Partial<ActivityFormValues> = {
    title: activityData.title,
    category: activityData.category as ActivityFormValues['category'],
    description: activityData.description,
    price: activityData.price,
    address: activityData.address,
    bannerImageUrl: activityData.bannerImageUrl,
    subImageUrls: activityData.subImages?.map((img) => img.imageUrl) || [],
    schedules: defaultSchedules,
  };

  return (
    <ActivityForm defaultValues={defaultValues} onSubmit={handleEditSubmit}>
      <Button type="submit" size="md" className="mx-auto w-30">
        수정하기
      </Button>
    </ActivityForm>
  );
}

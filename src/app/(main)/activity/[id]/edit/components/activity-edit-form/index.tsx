'use client';

import { ActivityForm } from '@/app/(main)/activity/components/activity-form';
import { ActivityFormValues } from '@/app/(main)/activity/components/activity-form/activityForm.schema';
import { Button } from '@/shared/components/buttons';

export function ActivityEditForm() {
  const handleEditSubmit = (data: ActivityFormValues) => {
    // TODO: 수정 API 호출 로직
    const payload = {
      ...data,
      schedules: data.schedules.map(({ id: _id, ...rest }) => rest),
    };
    console.log('API로 보낼 데이터:', payload);
  };

  return (
    // TODO: ActivityForm에 initialData를 넘겨주는 로직 추가
    <ActivityForm onSubmit={handleEditSubmit}>
      <Button type="submit" size="md" className="mx-auto w-30">
        수정하기
      </Button>
    </ActivityForm>
  );
}

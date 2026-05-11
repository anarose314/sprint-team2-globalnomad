'use client';

import { ActivityForm } from '@/app/(main)/activity/components/activity-form';
import { ActivityFormValues } from '@/app/(main)/activity/components/activity-form/activityForm.schema';
import { Button } from '@/shared/components/buttons';

export function ActivityAddForm() {
  const handleAddSubmit = (data: ActivityFormValues) => {
    // TODO: 등록 API 호출 로직
    const payload = {
      ...data,
      schedules: data.schedules.map(({ id: _id, ...rest }) => rest),
    };
    console.log('API로 보낼 데이터:', payload);
  };

  return (
    <ActivityForm onSubmit={handleAddSubmit}>
      <Button type="submit" size="md" className="mx-auto w-30">
        등록하기
      </Button>
    </ActivityForm>
  );
}

'use client';

import { ActivityForm } from '@/app/(main)/activity/components/activity-form';
import { Button } from '@/shared/components/buttons';

export function ActivityAddForm() {
  const handleAddSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: 등록 API 호출 로직
  };

  return (
    <ActivityForm onSubmit={handleAddSubmit}>
      <Button type="submit" size="md" className="mx-auto w-30">
        등록하기
      </Button>
    </ActivityForm>
  );
}

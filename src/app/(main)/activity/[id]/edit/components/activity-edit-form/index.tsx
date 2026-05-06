'use client';

import { ActivityForm } from '@/app/(main)/activity/components/activity-form';
import { Button } from '@/shared/components/buttons';

export function ActivityEditForm() {
  const handleEditSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: 수정 API 호출 로직
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

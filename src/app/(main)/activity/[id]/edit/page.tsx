import { Metadata } from 'next';
import { ActivityEditForm } from '@/app/(main)/activity/[id]/edit/components/activity-edit-form';
import { Heading } from '@/shared/components/heading';

// TODO: 추후 API 연동 후 동적 이름으로 변경
export const metadata: Metadata = {
  title: '체험 이름 - 수정',
};

export default function ActivityEditPage() {
  return (
    <div className="mx-auto mt-7.5 mb-9 w-full max-w-175 md:mt-10 md:mb-16 2xl:mb-30">
      <Heading>내 체험 수정</Heading>
      <ActivityEditForm />
    </div>
  );
}

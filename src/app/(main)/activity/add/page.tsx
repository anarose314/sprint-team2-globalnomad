import { Metadata } from 'next';
import { ActivityAddForm } from '@/app/(main)/activity/add/components/activity-add-form';
import { Heading } from '@/shared/components/heading';

export const metadata: Metadata = {
  title: '내 체험 등록',
};

export default function ActivityAddPage() {
  return (
    <div className="mx-auto mt-7.5 mb-9 w-full max-w-175 md:mt-10 md:mb-16 2xl:mb-30">
      <Heading>내 체험 등록</Heading>
      <ActivityAddForm />
    </div>
  );
}

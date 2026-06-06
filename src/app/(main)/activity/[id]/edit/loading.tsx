import { ActivityFormSkeleton } from '@/app/(main)/activity/components/activity-form-skeleton';
import { Heading } from '@/shared/components/heading';

export default function EditLoading() {
  return (
    <div className="mx-auto mt-7.5 mb-9 w-full max-w-175 md:mt-10 md:mb-16 2xl:mb-30">
      <Heading>내 체험 수정</Heading>
      <ActivityFormSkeleton />
    </div>
  );
}

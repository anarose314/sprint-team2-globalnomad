import { Suspense } from 'react';
import { Metadata } from 'next';
import { MyActivitiesDashboardContent } from '@/app/(main)/my/activities-dashboard/components/myActivitiesDashboardContent';
import { Heading } from '@/shared/components/heading';

export const metadata: Metadata = {
  title: '예약 현황',
};

export default function MyActivitiesDashboardPage() {
  return (
    <section className="mx-auto mb-16.5 md:mb-43 2xl:mb-40">
      <Heading>예약 현황</Heading>
      <p className="typo-md-medium mt-2.5 text-gray-500 md:mt-2">
        내 체험에 예약된 내역들을 한 눈에 확인할 수 있습니다.
      </p>
      <Suspense
        fallback={
          <div
            aria-hidden="true"
            className="shadow-card bg-gray-25 mt-7 h-192 w-full animate-pulse rounded-3xl md:mt-6"
          />
        }
      >
        <MyActivitiesDashboardContent />
      </Suspense>
    </section>
  );
}

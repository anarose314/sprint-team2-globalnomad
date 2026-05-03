import { Metadata } from 'next';
import { ReservationCalendarClient } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/ReservationCalendarClient';
import { IcArrowDown } from '@/shared/assets/icons';
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

      {/* TODO: 드롭다운 공통 컴포넌트로 교체 */}
      <button
        type="button"
        className="shadow-custom mt-6 flex h-13.5 w-full cursor-pointer items-center justify-between rounded-2xl border border-gray-100 bg-white px-5 py-4 2xl:mt-7.5"
      >
        <span className="typo-lg-medium text-gray-950">
          함께 배우면 즐거운 스트릿 댄스
        </span>
        <IcArrowDown className="h-6 w-6 text-gray-950" />
      </button>

      <ReservationCalendarClient />
    </section>
  );
}

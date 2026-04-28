import { Metadata } from 'next';
import {
  IcArrowDown,
  IcArrowNaviLeft,
  IcArrowNaviRight,
} from '@/shared/assets/icons';

export const metadata: Metadata = {
  title: '예약 현황',
};

export default function MyActivitiesDashboardPage() {
  return (
    <section className="mx-auto mb-[66px] w-[327px] md:mb-[172px] md:w-[476px] 2xl:mb-[160px] 2xl:w-[640px]">
      <h2 className="typo-2lg-bold text-gray-950">예약 현황</h2>
      <p className="typo-md-medium mt-2.5 text-gray-500 md:mt-2">
        내 체험에 예약된 내역들을 한 눈에 확인할 수 있습니다.
      </p>

      <button
        type="button"
        className="shadow-custom mt-6 flex h-[54px] w-full cursor-pointer items-center justify-between rounded-2xl border border-gray-100 bg-white px-5 py-4 2xl:mt-7.5"
      >
        <span className="typo-lg-medium text-gray-950">
          함께 배우면 즐거운 스트릿 댄스
        </span>
        <IcArrowDown className="h-6 w-6 text-gray-950" />
      </button>

      <div className="md:shadow-card mt-4.5 h-[779px] w-full rounded-3xl border-0 bg-white pt-5 pb-2.5 shadow-none md:mt-6 2xl:mt-7.5">
        <div className="flex h-full flex-col gap-7.5 px-5 md:px-8">
          <div className="flex items-center justify-between">
            <button
              type="button"
              aria-label="이전 달"
              className="flex h-8 w-8 items-center justify-center text-gray-950"
            >
              <IcArrowNaviLeft className="h-6 w-6" />
            </button>
            <h3 className="typo-2lg-medium md:typo-xl-medium text-gray-950">
              2026년 9월
            </h3>
            <button
              type="button"
              aria-label="다음 달"
              className="flex h-8 w-8 items-center justify-center text-gray-950"
            >
              <IcArrowNaviRight className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-7 border-b border-gray-50 pb-3">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <span
                key={`${day}-${index}`}
                className="typo-lg-semibold flex items-center justify-center text-gray-950"
              >
                {day}
              </span>
            ))}
          </div>

          <div className="flex-1 rounded-2xl border-0 bg-white" />
        </div>
      </div>
    </section>
  );
}

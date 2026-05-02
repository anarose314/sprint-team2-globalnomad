import { IcArrowLeft, IcArrowRight } from '@/shared/assets/icons';

const DAYS_OF_WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;

export function ReservationCalendar() {
  return (
    <div className="md:shadow-card mt-4.5 min-h-[779px] w-full rounded-3xl border-0 bg-white pt-5 pb-2.5 shadow-none md:mt-6 2xl:mt-7.5">
      <div className="flex h-full flex-col gap-7.5 px-5 md:px-8">
        <div className="flex items-center justify-between">
          <button
            type="button"
            aria-label="이전 달"
            className="flex h-8 w-8 items-center justify-center text-gray-950"
          >
            <IcArrowLeft className="h-6 w-6" />
          </button>
          <h3 className="typo-2lg-medium md:typo-xl-medium text-gray-950">
            2026년 9월
          </h3>
          <button
            type="button"
            aria-label="다음 달"
            className="flex h-8 w-8 items-center justify-center text-gray-950"
          >
            <IcArrowRight className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-7 border-b border-gray-50 pb-3">
          {DAYS_OF_WEEK.map((day, index) => (
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
  );
}

import { MOCK_TIME_SLOTS } from '@/app/(main)/activity/[id]/components/activity-reservation-card/activityReservationCard.constants';
import type {
  CalendarValue,
  TimeSlot,
} from '@/app/(main)/activity/[id]/components/activity-reservation-card/activityReservationCard.types';
import { ReservationCalendarView } from '@/app/(main)/activity/[id]/components/activity-reservation-card/components/reservationCalendarView';
import { TimeSlotButton } from '@/app/(main)/activity/[id]/components/time-slot-button';
import { IcMinus, IcPlus } from '@/shared/assets/icons';
import { Button } from '@/shared/components/buttons/button';

interface DesktopReservationCardProps {
  selectedDate: Date;
  currentDate: Date;
  monthTitle: string;
  headCount: number;
  totalPrice: number;
  selectedTimeSlot: TimeSlot;
  onDateChange: (value: CalendarValue) => void;
  onMonthChange: (activeStartDate?: Date | null) => void;
  onDecreaseHeadCount: () => void;
  onIncreaseHeadCount: () => void;
  onSelectTimeSlot: (slot: TimeSlot) => () => void;
}

/**
 * @description PC(2xl+) 전용 예약 카드
 */
export function DesktopReservationCard({
  selectedDate,
  currentDate,
  monthTitle,
  headCount,
  totalPrice,
  selectedTimeSlot,
  onDateChange,
  onMonthChange,
  onDecreaseHeadCount,
  onIncreaseHeadCount,
  onSelectTimeSlot,
}: DesktopReservationCardProps) {
  return (
    <aside className="hidden w-full 2xl:block">
      <div className="shadow-review-card mx-auto w-full max-w-103 overflow-hidden rounded-3xl border border-gray-100 bg-white">
        <div className="max-h-[calc(100dvh-(--spacing(24))-(--spacing(10)))] overflow-y-auto overscroll-contain p-8">
          <div className="mx-auto w-88">
            <div className="flex items-end">
              <span className="typo-2xl-bold text-gray-950">₩1,000</span>
              <span className="typo-xl-medium ml-1 text-gray-600">/ 인</span>
            </div>

            <div className="mt-6">
              <ReservationCalendarView
                value={selectedDate}
                activeStartDate={currentDate}
                monthTitle={monthTitle}
                onDateChange={onDateChange}
                onMonthChange={onMonthChange}
                className="activity-booking-calendar"
              />
            </div>

            <div className="mt-6 flex h-10 items-center justify-between">
              <span className="typo-lg-bold text-gray-950">참여 인원 수</span>
              <div className="flex h-10 w-35 items-center justify-between rounded-3xl border border-gray-200 px-2.5">
                <button
                  type="button"
                  aria-label="인원 감소"
                  onClick={onDecreaseHeadCount}
                  className="inline-flex h-6 w-6 cursor-pointer items-center justify-center text-gray-800"
                >
                  <IcMinus className="h-4 w-4" />
                </button>
                <span className="typo-lg-bold text-gray-800">{headCount}</span>
                <button
                  type="button"
                  aria-label="인원 증가"
                  onClick={onIncreaseHeadCount}
                  className="inline-flex h-6 w-6 cursor-pointer items-center justify-center text-gray-800"
                >
                  <IcPlus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-6">
              <p className="typo-lg-bold text-gray-950">예약 가능한 시간</p>
              <div className="mt-3.5 mb-6 flex flex-col gap-3">
                {MOCK_TIME_SLOTS.map((slot) => (
                  <TimeSlotButton
                    key={slot}
                    size="pc"
                    isActive={selectedTimeSlot === slot}
                    onClick={onSelectTimeSlot(slot)}
                  >
                    {slot}
                  </TimeSlotButton>
                ))}
              </div>
            </div>

            <div className="flex h-20 items-center justify-between border-t border-gray-100">
              <div className="flex items-end gap-1">
                <span className="typo-xl-medium text-gray-600">총 합계</span>
                <span className="typo-xl-bold text-gray-950">
                  {new Intl.NumberFormat('ko-KR').format(totalPrice)}원
                </span>
              </div>
              <Button size="sm" className="w-30">
                예약하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

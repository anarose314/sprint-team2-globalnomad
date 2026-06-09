import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  CalendarValue,
  MobileSheetStep,
  TimeSlot,
} from '@/app/(main)/activity/[id]/components/activity-reservation-card/activityReservationCard.types';
import { HeadCountStepperIconButton } from '@/app/(main)/activity/[id]/components/activity-reservation-card/components/headCountStepperIconButton';
import { ReservationCalendarView } from '@/app/(main)/activity/[id]/components/activity-reservation-card/components/reservationCalendarView';
import { TimeSlotButton } from '@/app/(main)/activity/[id]/components/time-slot-button';
import { IcArrowLeft, IcMinus, IcPlus } from '@/shared/assets/icons';
import { Button } from '@/shared/components/buttons/button';
import { Heading } from '@/shared/components/heading';
import { cn } from '@/shared/utils/cn';

const MOBILE_RESERVATION_SHEET_CLOSE_MS = 320;

function getMobileReservationSheetCloseMs() {
  if (typeof window === 'undefined') return MOBILE_RESERVATION_SHEET_CLOSE_MS;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 0
    : MOBILE_RESERVATION_SHEET_CLOSE_MS;
}

interface MobileReservationSheetProps {
  isOpen: boolean;
  mobileSheetStep: MobileSheetStep;
  hasSelectableDate: boolean;
  selectedDate: Date | null;
  currentDate: Date;
  monthTitle: string;
  selectedDateText: string;
  selectedTimeSlot: TimeSlot | null;
  availableTimeSlots: TimeSlot[];
  headCount: number;
  totalPrice: number;
  isReservationAvailable: boolean;
  isReservationSubmitting: boolean;
  onClose: () => void;
  onMoveToHeadCountStep: () => void;
  onMoveToDateTimeStep: () => void;
  onDateChange: (value: CalendarValue) => void;
  onMonthChange: (activeStartDate?: Date | null) => void;
  onSelectTimeSlot: (slot: TimeSlot) => () => void;
  onDecreaseHeadCount: () => void;
  onIncreaseHeadCount: () => void;
  onSubmitReservation: () => void;
  tileDisabled: (props: { date: Date; view: string }) => boolean;
}

/**
 * @description 모바일/태블릿 날짜 선택 바텀시트
 */
export function MobileReservationSheet({
  isOpen,
  mobileSheetStep,
  hasSelectableDate,
  selectedDate,
  currentDate,
  monthTitle,
  selectedDateText,
  selectedTimeSlot,
  availableTimeSlots,
  headCount,
  totalPrice,
  isReservationAvailable,
  isReservationSubmitting,
  onClose,
  onMoveToHeadCountStep,
  onMoveToDateTimeStep,
  onDateChange,
  onMonthChange,
  onSelectTimeSlot,
  onDecreaseHeadCount,
  onIncreaseHeadCount,
  onSubmitReservation,
  tileDisabled,
}: MobileReservationSheetProps) {
  const isClosingRef = useRef(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const requestClose = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    setIsClosing(true);
    const durationMs = getMobileReservationSheetCloseMs();
    closeTimerRef.current = setTimeout(() => {
      onClose();
    }, durationMs);
  }, [onClose]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    isClosingRef.current = false;
    if (!isOpen && closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    // effect 본문에서 동기 setState는 React Compiler 경고 대상 → 다음 마이크로태스크로 미룸
    queueMicrotask(() => {
      setIsClosing(false);
    });
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        'z-modal-backdrop fixed inset-0 bg-black/60 2xl:hidden',
        isClosing
          ? 'animate-reservation-sheet-backdrop-out'
          : 'animate-reservation-sheet-backdrop-in'
      )}
      onClick={requestClose}
    >
      <section
        className={cn(
          'shadow-review-card absolute right-0 bottom-0 left-0 max-h-dvh w-full overflow-y-auto overscroll-contain rounded-t-2xl bg-white px-5 pt-14 pb-5 md:pt-7 md:pb-5',
          isClosing
            ? 'animate-reservation-sheet-out'
            : 'animate-reservation-sheet-in'
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto w-full max-w-186">
          <div className="md:hidden">
            {mobileSheetStep === 'dateTime' ? (
              <>
                <ReservationCalendarView
                  value={selectedDate}
                  activeStartDate={currentDate}
                  monthTitle={monthTitle}
                  onDateChange={onDateChange}
                  onMonthChange={onMonthChange}
                  tileDisabled={tileDisabled}
                  className="activity-booking-calendar activity-booking-sheet-calendar"
                />

                <div className="mt-6">
                  <p className="typo-lg-bold text-gray-950">예약 가능한 시간</p>
                  <div className="mt-3 flex flex-col gap-3">
                    {availableTimeSlots.length > 0 ? (
                      availableTimeSlots.map((slot) => (
                        <TimeSlotButton
                          key={slot.id}
                          size="tb"
                          isActive={selectedTimeSlot?.id === slot.id}
                          onClick={onSelectTimeSlot(slot)}
                          className="w-full"
                        >
                          {slot.startTime} ~ {slot.endTime}
                        </TimeSlotButton>
                      ))
                    ) : selectedDate ? (
                      <p className="typo-md-medium rounded-xl border border-gray-100 px-4 py-3 text-gray-500">
                        {hasSelectableDate
                          ? '선택한 날짜에 예약 가능한 시간이 없습니다.'
                          : '예약 가능한 날짜가 없습니다.'}
                      </p>
                    ) : null}
                  </div>
                </div>

                <Button
                  size="lg"
                  className="mt-6 w-full"
                  disabled={!selectedTimeSlot}
                  onClick={onMoveToHeadCountStep}
                >
                  확인
                </Button>
              </>
            ) : (
              <>
                <div className="mb-5 flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="날짜 및 시간 선택 단계로 돌아가기"
                    onClick={onMoveToDateTimeStep}
                    className="inline-flex h-8 w-8 cursor-pointer items-center justify-center text-gray-950"
                  >
                    <IcArrowLeft className="h-5 w-5" />
                  </button>
                  <Heading as="h3" textStyle="typo-2lg-bold">
                    인원
                  </Heading>
                </div>

                <p className="typo-lg-medium mb-3.5 text-gray-800">
                  예약할 인원을 선택해주세요.
                </p>

                <div className="bg-primary-50 mb-5 flex items-center justify-between rounded-xl px-6 py-4">
                  <span className="typo-md-bold text-gray-950">
                    {selectedDateText}
                  </span>
                  <span className="typo-xs-medium text-gray-600">
                    {selectedTimeSlot
                      ? `${selectedTimeSlot.startTime} ~ ${selectedTimeSlot.endTime}`
                      : '-'}
                  </span>
                </div>

                <div className="mb-8 flex items-center justify-between">
                  <p className="typo-lg-bold text-gray-950">참여 인원 수</p>
                  <div className="flex h-12 w-36 items-center justify-between rounded-2xl border border-gray-100 px-4">
                    <HeadCountStepperIconButton
                      aria-label="인원 감소"
                      onClick={onDecreaseHeadCount}
                    >
                      <IcMinus className="h-4 w-4" />
                    </HeadCountStepperIconButton>
                    <span className="typo-lg-bold text-gray-800">
                      {headCount}
                    </span>
                    <HeadCountStepperIconButton
                      aria-label="인원 증가"
                      onClick={onIncreaseHeadCount}
                    >
                      <IcPlus className="h-4 w-4" />
                    </HeadCountStepperIconButton>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  disabled={!isReservationAvailable || isReservationSubmitting}
                  onClick={onSubmitReservation}
                >
                  {new Intl.NumberFormat('ko-KR').format(totalPrice)}원 예약하기
                </Button>
              </>
            )}
          </div>

          <div className="hidden md:block">
            <div className="flex items-start justify-center gap-6">
              <div className="w-90">
                <ReservationCalendarView
                  value={selectedDate}
                  activeStartDate={currentDate}
                  monthTitle={monthTitle}
                  onDateChange={onDateChange}
                  onMonthChange={onMonthChange}
                  tileDisabled={tileDisabled}
                  className="activity-booking-calendar activity-booking-sheet-calendar"
                />
              </div>

              <div className="shadow-review-card h-102 w-75 overflow-y-auto overscroll-contain rounded-3xl bg-white p-5">
                <p className="typo-lg-bold text-gray-950">예약 가능한 시간</p>
                <div className="mt-3 flex flex-col gap-3">
                  {availableTimeSlots.length > 0 ? (
                    availableTimeSlots.map((slot) => (
                      <TimeSlotButton
                        key={slot.id}
                        size="tb"
                        isActive={selectedTimeSlot?.id === slot.id}
                        onClick={onSelectTimeSlot(slot)}
                        className="w-full"
                      >
                        {slot.startTime} ~ {slot.endTime}
                      </TimeSlotButton>
                    ))
                  ) : selectedDate ? (
                    <p className="typo-md-medium rounded-xl border border-gray-100 px-4 py-3 text-gray-500">
                      {hasSelectableDate
                        ? '선택한 날짜에 예약 가능한 시간이 없습니다.'
                        : '예약 가능한 날짜가 없습니다.'}
                    </p>
                  ) : null}
                </div>
                <div className="mt-7">
                  <p className="typo-lg-bold text-gray-950">참여 인원 수</p>
                  <div className="mt-3 flex h-12 w-full items-center justify-between rounded-2xl border border-gray-200 px-5">
                    <HeadCountStepperIconButton
                      aria-label="인원 감소"
                      onClick={onDecreaseHeadCount}
                    >
                      <IcMinus className="h-4 w-4" />
                    </HeadCountStepperIconButton>
                    <span className="typo-2lg-bold text-gray-800">
                      {headCount}
                    </span>
                    <HeadCountStepperIconButton
                      aria-label="인원 증가"
                      onClick={onIncreaseHeadCount}
                    >
                      <IcPlus className="h-4 w-4" />
                    </HeadCountStepperIconButton>
                  </div>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              className="mt-6 w-full"
              disabled={!isReservationAvailable || isReservationSubmitting}
              onClick={onSubmitReservation}
            >
              {new Intl.NumberFormat('ko-KR').format(totalPrice)}원 예약하기
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

'use client';

import { timeSlotVariants } from '@/app/(main)/activity/[id]/components/time-slot-button/timeSlotButton.constants';
import type { TimeSlotButtonProps } from '@/app/(main)/activity/[id]/components/time-slot-button/timeSlotButton.types';
import { cn } from '@/shared/utils/cn';

export type { TimeSlotButtonProps };

/**
 * 체험 시간대 선택 버튼
 *
 * 버튼 내부 텍스트(시간 범위)는 API에서 받아온 값을 `children`으로 전달
 * 예약 불가 시간대는 `disabled`로 전달하며 색상만으로 구분되지 않도록
 * `aria-disabled`도 함께 전달한다. `isMine`이면 "내 예약" 표시가 추가된다.
 *
 * - 기본 상태 : 흰 배경 + gray-300 테두리 (hover 시 primary 계열로 전환)
 * - 선택 상태(`isActive`) : primary-100 배경 + primary-500 테두리·텍스트
 * - 비활성 상태(`disabled`) : gray-50 배경 + gray-200 테두리·gray-400 텍스트
 * - `size="pc"` : 350×54 (border 포함)
 * - `size="tb"` : 253×54 (border 포함)
 * - `size="mb"` : 327×48 (border 포함)
 *
 * @example
 * <TimeSlotButton size="pc">14:00 ~ 15:00</TimeSlotButton>
 *
 * @example
 * <TimeSlotButton size="mb" isActive>15:00 ~ 16:00</TimeSlotButton>
 *
 * @example
 * {timeSlots.map((slot) => (
 *   <TimeSlotButton
 *     key={slot.id}
 *     size="pc"
 *     isActive={selectedId === slot.id}
 *     isMine={slot.status === 'mine'}
 *     disabled={slot.status !== 'available'}
 *     onClick={() => setSelectedId(slot.id)}
 *   >
 *     {slot.startTime} ~ {slot.endTime}
 *   </TimeSlotButton>
 * ))}
 */
export function TimeSlotButton({
  size = 'pc',
  isActive = false,
  isMine = false,
  disabled = false,
  className,
  children,
  ...rest
}: TimeSlotButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-disabled={disabled}
      className={cn(timeSlotVariants({ size, isActive }), className)}
      {...rest}
    >
      {children}
      {isMine ? <span className="typo-xs-medium shrink-0">내 예약</span> : null}
    </button>
  );
}

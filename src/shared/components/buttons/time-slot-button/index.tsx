'use client';

import { timeSlotVariants } from '@/shared/components/buttons/time-slot-button/timeSlotButton.constants';
import type { TimeSlotButtonProps } from '@/shared/components/buttons/time-slot-button/timeSlotButton.types';
import { cn } from '@/shared/utils/cn';

export type { TimeSlotButtonProps };

/**
 * 예약 가능한 시간대 선택 버튼
 *
 * 버튼 내부 텍스트(시간 범위)는 API에서 받아온 값을 `children`으로 전달
 * 가능한 시간대만 렌더링하므로 `disabled` 상태는 제공하지 않는다.
 *
 * - 기본 상태 : 흰 배경 + gray-300 테두리 (hover 시 primary 계열로 전환)
 * - 선택 상태(`isActive`) : primary-100 배경 + primary-500 테두리·텍스트
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
 *     onClick={() => setSelectedId(slot.id)}
 *   >
 *     {slot.startTime} ~ {slot.endTime}
 *   </TimeSlotButton>
 * ))}
 */
export function TimeSlotButton({
  size = 'pc',
  isActive = false,
  className,
  children,
  ...rest
}: TimeSlotButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        timeSlotVariants({ size }),
        isActive
          ? 'border-primary-500 bg-primary-100 text-primary-500'
          : 'hover:border-primary-500 hover:bg-primary-100 hover:text-primary-500 border-gray-300 bg-white text-gray-950',
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

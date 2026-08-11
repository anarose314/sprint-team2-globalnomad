import type { CalendarProps } from 'react-calendar';

/**
 * @description 모바일 바텀시트 예약 플로우 단계
 */
export type MobileSheetStep = 'dateTime' | 'headCount';

/**
 * @description `react-calendar` onChange에서 전달하는 값 타입
 */
export type CalendarValue = Parameters<
  NonNullable<CalendarProps['onChange']>
>[0];

export interface TimeSlot {
  id: number;
  startTime: string;
  endTime: string;
}

/**
 * @description 시간대의 예약 가능 상태
 * - `available` : 예약 가능(선택 가능)
 * - `mine` : 내가 이미 예약한 시간대
 * - `unavailable` : 그 외 예약할 수 없는 시간대(이유 표시 없이 비활성화)
 */
export type TimeSlotAvailability = 'available' | 'mine' | 'unavailable';

export interface TimeSlotWithStatus extends TimeSlot {
  status: TimeSlotAvailability;
}

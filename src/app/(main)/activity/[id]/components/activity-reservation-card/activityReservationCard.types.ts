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

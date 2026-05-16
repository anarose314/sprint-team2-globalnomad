import { Schedule } from '@/app/(main)/activity/components/reserve-time/reserveTime.types';
import { isValidReserveTime } from '@/app/(main)/activity/utils/isValidReserveTime';

interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

/**
 * 예약 일정의 유효성(빈 값, 시간 선후 관계, 중복 여부)을 검사하는 유틸 함수
 *
 * @example
 * ```ts
 * const { isValid, errorMessage } = validateSchedule(newSchedule, schedules, currentId);
 *
 * if (!isValid) {
 * showToast({ theme: 'error', message: errorMessage! });
 * return;
 * }
 * ```
 */
export const validateSchedule = (
  target: Schedule,
  existingSchedules: Schedule[],
  currentId?: string
): ValidationResult => {
  const { date, startTime, endTime } = target;

  // CASE 1: 빈 값 유효성 검사
  if (!date || !startTime || !endTime) {
    return {
      isValid: false,
      errorMessage: '날짜와 시간을 모두 선택해 주세요.',
    };
  }

  // CASE 2: 예약 가능 최소 시간 유효성 검사 (현재 시간 기준 1시간 이후부터 가능)
  if (!isValidReserveTime(date, startTime)) {
    return {
      isValid: false,
      errorMessage: '현재 시간으로부터 1시간 이후의 일정만 등록할 수 있습니다.',
    };
  }

  // CASE 3: 시간 선후 관계 유효성 검사
  if (startTime >= endTime) {
    return {
      isValid: false,
      errorMessage: '종료 시간은 시작 시간 이후여야 합니다.',
    };
  }

  // CASE 4: 중복 유효성 검사
  const isDuplicate = existingSchedules.some(
    (existing) =>
      existing.id !== currentId &&
      existing.date === date &&
      existing.startTime === startTime &&
      existing.endTime === endTime
  );

  if (isDuplicate) {
    return { isValid: false, errorMessage: '이미 등록된 일정입니다.' };
  }

  return { isValid: true };
};

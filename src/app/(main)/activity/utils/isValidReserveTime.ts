/**
 * 선택된 예약 시간이 현재 시간 기준 1시간(유예 시간) 이후인지 검증하는 유틸 함수
 * 유효면 true, 아니면 false 반환
 *
 * @example
 * ```ts
 * const isValid = isValidReserveTime('2026-05-16', '15:30');
 *
 * if (!isValid) {
 *   showToast({ theme: 'error', message: '1시간 이후의 일정만 등록 가능합니다.' });
 *   return;
 * }
 * ```
 */
export const isValidReserveTime = (
  date: string,
  startTime: string
): boolean => {
  const limitDate = new Date().getTime() + 60 * 60 * 1000;
  const targetDate = new Date(`${date}T${startTime}`).getTime();

  return limitDate <= targetDate;
};

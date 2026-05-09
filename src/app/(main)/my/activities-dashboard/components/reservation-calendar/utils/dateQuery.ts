import { formatDateKey } from '@/shared/utils/formatDate';

const DATE_QUERY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * URL `date` 쿼리값을 검증해 유효한 날짜 키만 반환
 *
 * @param rawValue - 검색 파라미터의 원본 문자열
 * @returns `YYYY-MM-DD` 형식의 유효한 날짜 키, 실패 시 `null`
 */
export const parseDateQueryKey = (rawValue: string | null): string | null => {
  if (!rawValue || !DATE_QUERY_PATTERN.test(rawValue)) return null;

  const parsedDate = new Date(`${rawValue}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) return null;

  return formatDateKey(parsedDate) === rawValue ? rawValue : null;
};

/**
 * 날짜 키 문자열(`YYYY-MM-DD`)을 로컬 기준 `Date`로 변환
 *
 * @param dateKey - 검증된 날짜 키 문자열
 * @returns 해당 날짜의 00:00 시각 `Date`
 */
export const toDateFromDateKey = (dateKey: string): Date =>
  new Date(`${dateKey}T00:00:00`);

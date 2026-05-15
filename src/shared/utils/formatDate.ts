const pad2 = (value: number) => String(value).padStart(2, '0');

/**
 * ISO 날짜 문자열을 `YYYY. MM. DD` 포맷으로 변환
 *
 * @example
 * formatDate('2026-05-04T12:00:00Z') // "2026. 05. 04"
 */
export const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) return '-';

  return `${date.getFullYear()}. ${pad2(date.getMonth() + 1)}. ${pad2(date.getDate())}`;
};

/**
 * Date 객체를 `YYYY-MM-DD` 형태의 캘린더 키 값으로 변환
 *
 * @example
 * formatDateKey(new Date()) // "2026-05-04"
 */
export const formatDateKey = (date: Date) => {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
};

/**
 * API·캘린더에서 오는 날짜 문자열을 비교용 `YYYY-MM-DD`로 통일한다.
 *
 * - `YYYY-MM-DD` 또는 그 뒤에 `T`/공백이 이어지는 ISO 형태는 **문자열의 날짜 부분만** 사용해
 *   `new Date('YYYY-MM-DD')`의 UTC 자정 해석으로 인한 하루 어긋남을 피한다.
 * - 그 외 형식은 로컬 `Date` 파싱 후 `formatDateKey`로 변환(파싱 불가 시 원문 반환).
 */
export const normalizeCalendarDateKey = (rawDate: string) => {
  const trimmed = rawDate.trim();
  if (!trimmed) return trimmed;

  const head10 = trimmed.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(head10)) {
    return head10;
  }

  const dashedPrefix = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T\s]|$)/);
  if (dashedPrefix) {
    const year = Number(dashedPrefix[1]);
    const month = Number(dashedPrefix[2]);
    const day = Number(dashedPrefix[3]);
    if (
      Number.isInteger(year) &&
      month >= 1 &&
      month <= 12 &&
      day >= 1 &&
      day <= 31
    ) {
      return `${year}-${pad2(month)}-${pad2(day)}`;
    }
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return trimmed;
  return formatDateKey(parsed);
};

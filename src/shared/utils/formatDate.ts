const pad2 = (value: number) => String(value).padStart(2, '0');

/**
 * ISO 날짜 문자열을 `YYYY. MM. DD` 포맷으로 변환
 *
 * @example
 * formatDate('2026-05-04T12:00:00Z') // "2026. 05. 04"
 */
export const formatDate = (isoDate: string) => {
  const dateOnlyMatch = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;
    return `${year}. ${month}. ${day}`;
  }

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

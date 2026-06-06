const pad2 = (value: number) => String(value).padStart(2, '0');

/**
 * ISO 날짜 문자열을 `YYYY. MM. DD` 포맷으로 변환
 *
 * @example
 * formatDate('2026-05-04T12:00:00Z') // "2026. 05. 04"
 */
export const formatDate = (isoDate: string) => {
  const parsedDate = new Date(isoDate);
  if (Number.isNaN(parsedDate.getTime())) return '-';

  const dateOnlyMatch = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;
    const utcDate = new Date(`${year}-${month}-${day}T00:00:00Z`);
    const isValidDate =
      utcDate.getUTCFullYear() === Number(year) &&
      utcDate.getUTCMonth() + 1 === Number(month) &&
      utcDate.getUTCDate() === Number(day);

    if (!isValidDate) return '-';

    return `${year}. ${month}. ${day}`;
  }

  return `${parsedDate.getFullYear()}. ${pad2(parsedDate.getMonth() + 1)}. ${pad2(parsedDate.getDate())}`;
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
 * `YYYY-MM-DD` 형식의 날짜 문자열을 `YYYY년 MM월 DD일 (요일)` 포맷으로 변환
 *
 * @example
 * formatDateKorean('2026-06-04') // "2026년 06월 04일 (목)"
 */
export const formatDateKorean = (dateStr: string): string => {
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return '-';
  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const dayLabel = days[date.getDay()];
  return `${year}년 ${month}월 ${day}일 (${dayLabel})`;
};

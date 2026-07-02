const KST_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const toKstDateKey = (date: Date) => {
  const parts = KST_DATE_FORMATTER.formatToParts(date);
  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;

  if (!year || !month || !day) {
    return '';
  }

  return `${year}-${month}-${day}`;
};

/**
 * 입력값을 KST 기준 `YYYY-MM-DD` 날짜 키로 정규화한다.
 *
 * @example
 * normalizeDateKey('2026-06-30T15:00:00.000Z') // '2026-07-01'
 */
export const normalizeDateKey = (rawDate: unknown) => {
  if (rawDate instanceof Date) {
    if (Number.isNaN(rawDate.getTime())) {
      return '';
    }

    return toKstDateKey(rawDate);
  }

  if (typeof rawDate !== 'string' || rawDate.length === 0) {
    return '';
  }

  const trimmed = rawDate.trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return trimmed;
  }

  return toKstDateKey(parsed) || trimmed;
};

/**
 * `HH:MM` 또는 `HH:MM:SS` 형식의 시간 문자열을 파싱해 시/분 반환
 * 형식이 올바르지 않거나 범위를 벗어나면 null을 반환
 */
export const parseTimeToHourMinute = (time: unknown) => {
  if (typeof time !== 'string' || time.length === 0) {
    return null;
  }

  const trimmed = time.trim();
  if (!/^\d{1,2}:\d{2}(:\d{2})?$/.test(trimmed)) {
    return null;
  }

  const [hourText, minuteText] = trimmed.split(':');
  const hour = Number(hourText);
  const minute = Number(minuteText);

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return null;
  }

  return { hour, minute };
};

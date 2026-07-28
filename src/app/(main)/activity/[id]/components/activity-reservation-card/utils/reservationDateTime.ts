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

/**
 * `dateKey`(`YYYY-MM-DD`)와 `startTime`이 `now` 기준 아직 지나지 않은 시각인지 판단한다.
 * 날짜/시각 형식이 유효하지 않으면 판단할 수 없으므로 안전하게 true를 반환한다.
 */
export const isUpcomingTimeSlot = (
  dateKey: string,
  startTime: string,
  now: Date
) => {
  const [yearText, monthText, dayText] = dateKey.split('-');
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const parsedTime = parseTimeToHourMinute(startTime);

  if (!parsedTime) {
    return true;
  }

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    return true;
  }

  const startDateTime = new Date(
    year,
    month - 1,
    day,
    parsedTime.hour,
    parsedTime.minute,
    0,
    0
  );

  if (Number.isNaN(startDateTime.getTime())) {
    return true;
  }

  return startDateTime.getTime() > now.getTime();
};

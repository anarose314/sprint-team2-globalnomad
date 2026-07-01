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

export const normalizeDateKey = (rawDate: unknown) => {
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

export const parseTimeToHourMinute = (time: unknown) => {
  if (typeof time !== 'string' || time.length === 0) {
    return null;
  }

  const [hourText, minuteText] = time.split(':');
  const hour = Number(hourText);
  const minute = Number(minuteText);

  if (
    !Number.isInteger(hour) ||
    !Number.isInteger(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return null;
  }

  return { hour, minute };
};

import { formatDateKey } from '@/shared/utils/formatDate';

export const normalizeDateKey = (rawDate: string) => {
  const trimmed = rawDate.trim();
  const shortDate = trimmed.slice(0, 10);

  if (/^\d{4}-\d{2}-\d{2}$/.test(shortDate)) {
    return shortDate;
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return trimmed;
  }

  return formatDateKey(parsed);
};

export const parseTimeToHourMinute = (time: string) => {
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

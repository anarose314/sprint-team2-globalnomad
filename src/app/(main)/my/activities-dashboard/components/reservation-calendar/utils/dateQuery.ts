import { formatDateKey } from '@/shared/utils/formatDate';

const DATE_QUERY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const parseDateQueryKey = (rawValue: string | null): string | null => {
  if (!rawValue || !DATE_QUERY_PATTERN.test(rawValue)) return null;

  const parsedDate = new Date(`${rawValue}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) return null;

  return formatDateKey(parsedDate) === rawValue ? rawValue : null;
};

export const toDateFromDateKey = (dateKey: string): Date =>
  new Date(`${dateKey}T00:00:00`);

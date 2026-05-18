const normalizeTimeWithSeconds = (time: string) => {
  const [hour = '00', minute = '00', second = '00'] = time.split(':');
  return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:${second.padStart(2, '0')}`;
};

/**
 * 날짜/시작 시각 기준으로 체험 시작 시각이 도래했는지(현재 시각이 시작 이후인지) 판단한다.
 */
export const isScheduleStartReached = (
  dateKey: string,
  startTime: string,
  now: Date
) => {
  const startAt = new Date(`${dateKey}T${normalizeTimeWithSeconds(startTime)}`);
  return !Number.isNaN(startAt.getTime()) && startAt.getTime() <= now.getTime();
};

/**
 * 날짜/종료 시각 기준으로 체험 종료 여부를 판단한다.
 */
export const isScheduleEnded = (
  dateKey: string,
  endTime: string,
  now: Date
) => {
  const endAt = new Date(`${dateKey}T${normalizeTimeWithSeconds(endTime)}`);
  return !Number.isNaN(endAt.getTime()) && endAt.getTime() <= now.getTime();
};

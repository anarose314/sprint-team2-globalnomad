import { describe, expect, it } from 'vitest';
import {
  normalizeDateKey,
  parseTimeToHourMinute,
} from '@/app/(main)/activity/[id]/components/activity-reservation-card/utils/reservationDateTime';
import { formatDateKey } from '@/shared/utils/formatDate';

describe('normalizeDateKey', () => {
  it('시간 정보가 포함된 ISO 문자열은 로컬 타임존 기준 날짜로 변환한다', () => {
    const isoDateTime = '2026-06-30T15:00:00.000Z';
    const expected = formatDateKey(new Date(isoDateTime));

    expect(normalizeDateKey(` ${isoDateTime} `)).toBe(expected);
  });

  it('순수 날짜 문자열은 그대로 유지한다', () => {
    expect(normalizeDateKey('2026-06-30')).toBe('2026-06-30');
  });

  it('파싱 가능한 문자열은 YYYY-MM-DD로 정규화한다', () => {
    expect(normalizeDateKey('2026/06/30 14:30')).toBe('2026-06-30');
  });

  it('파싱 불가능한 문자열은 trim 결과를 반환한다', () => {
    expect(normalizeDateKey(' invalid-date ')).toBe('invalid-date');
  });
});

describe('parseTimeToHourMinute', () => {
  it('정상 시각 문자열을 시/분 객체로 반환한다', () => {
    expect(parseTimeToHourMinute('09:30')).toEqual({ hour: 9, minute: 30 });
  });

  it('허용 범위를 벗어난 시각은 null을 반환한다', () => {
    expect(parseTimeToHourMinute('24:00')).toBeNull();
    expect(parseTimeToHourMinute('10:60')).toBeNull();
  });

  it('숫자로 파싱되지 않는 값은 null을 반환한다', () => {
    expect(parseTimeToHourMinute('aa:bb')).toBeNull();
  });
});

import { describe, expect, it } from 'vitest';
import {
  normalizeDateKey,
  parseTimeToHourMinute,
} from '@/app/(main)/activity/[id]/components/activity-reservation-card/utils/reservationDateTime';

describe('normalizeDateKey', () => {
  it('ISO 형식 문자열에서 날짜 부분만 추출한다', () => {
    expect(normalizeDateKey(' 2026-06-30T14:30:00.000Z ')).toBe('2026-06-30');
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

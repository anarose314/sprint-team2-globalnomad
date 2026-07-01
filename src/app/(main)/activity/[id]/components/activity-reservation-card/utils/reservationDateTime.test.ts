import { describe, expect, it } from 'vitest';
import {
  normalizeDateKey,
  parseTimeToHourMinute,
} from '@/app/(main)/activity/[id]/components/activity-reservation-card/utils/reservationDateTime';

describe('normalizeDateKey', () => {
  it('null/undefined 등 유효하지 않은 입력은 빈 문자열을 반환한다', () => {
    expect(normalizeDateKey(null)).toBe('');
    expect(normalizeDateKey(undefined)).toBe('');
    expect(normalizeDateKey(1234)).toBe('');
  });

  it('시간 정보가 포함된 ISO 문자열은 KST 기준 날짜로 변환한다', () => {
    expect(normalizeDateKey('2026-06-30T15:00:00.000Z')).toBe('2026-07-01');
  });

  it('순수 날짜 문자열은 그대로 유지한다', () => {
    expect(normalizeDateKey('2026-06-30')).toBe('2026-06-30');
  });

  it('오프셋이 포함된 datetime 문자열은 KST 기준으로 정규화한다', () => {
    expect(normalizeDateKey('2026-06-30T05:00:00-05:00')).toBe('2026-06-30');
  });

  it('파싱 불가능한 문자열은 trim 결과를 반환한다', () => {
    expect(normalizeDateKey(' invalid-date ')).toBe('invalid-date');
  });
});

describe('parseTimeToHourMinute', () => {
  it('null/undefined 등 유효하지 않은 입력은 null을 반환한다', () => {
    expect(parseTimeToHourMinute(null)).toBeNull();
    expect(parseTimeToHourMinute(undefined)).toBeNull();
    expect(parseTimeToHourMinute(930)).toBeNull();
    expect(parseTimeToHourMinute('')).toBeNull();
  });

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

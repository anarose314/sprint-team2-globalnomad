import { describe, expect, it } from 'vitest';
import { formatDateKey } from '@/shared/utils/formatDate';

describe('formatDateKey', () => {
  it('Date를 YYYY-MM-DD 키로 변환한다', () => {
    const date = new Date(2026, 5, 30);

    expect(formatDateKey(date)).toBe('2026-06-30');
  });

  it('월/일 한 자리 수를 0으로 패딩한다', () => {
    const date = new Date(2026, 0, 5);

    expect(formatDateKey(date)).toBe('2026-01-05');
  });
});

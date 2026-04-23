'use client';

import { IcArt } from '@/shared/assets/icons';
import {
  CATEGORY_ICON_MAP,
  FILTER_ICON_CLASS,
  filterButtonVariants,
} from '@/shared/components/buttons/filter-button/filterButton.constants';
import type { FilterButtonProps } from '@/shared/components/buttons/filter-button/filterButton.types';
import { cn } from '@/shared/utils/cn';

export type { FilterCategory } from '@/shared/components/buttons/filter-button/filterButton.types';

/**
 * 홈 화면 카테고리 필터링에 사용하는 pill 형태 버튼
 *
 * - `state="normal"` : 흰 배경 + 회색 테두리
 * - `state="active"` : 검정 배경 + 흰 텍스트
 * - 반응형 크기: 모바일 h-[37px] → PC/TB h-11 (md: 기준)
 *
 * @example
 * <FilterButton label="아트" category="art" state="normal" />
 *
 * @example
 * <FilterButton label="음식" category="food" state="active" />
 *
 * @example
 * <FilterButton label="전체" showIcon={false} state="normal" />
 *
 * @example
 * <FilterButton
 *   label="스포츠"
 *   category="sport"
 *   state={selected === 'sport' ? 'active' : 'normal'}
 *   onClick={() => setSelected('sport')}
 * />
 */
export function FilterButton({
  label,
  category,
  showIcon = true,
  state = 'normal',
  className,
  ...rest
}: FilterButtonProps) {
  const IconComponent = category ? CATEGORY_ICON_MAP[category] : IcArt;

  return (
    <button
      type="button"
      className={cn(filterButtonVariants({ state }), className)}
      {...rest}
    >
      {showIcon && <IconComponent className={FILTER_ICON_CLASS} />}
      <span>{label}</span>
    </button>
  );
}

'use client';

import { cloneElement, isValidElement } from 'react';
import {
  FILTER_ICON_CLASS,
  filterButtonVariants,
} from '@/shared/components/buttons/filter-button/filterButton.constants';
import type { FilterButtonProps } from '@/shared/components/buttons/filter-button/filterButton.types';
import { cn } from '@/shared/utils/cn';

export type { FilterButtonProps } from '@/shared/components/buttons/filter-button/filterButton.types';

/**
 * pill 형태의 필터·토글용 버튼
 *
 * - `state="normal"` : 흰 배경 + 회색 테두리
 * - `state="active"` : 검정 배경 + 흰 텍스트
 * - 반응형 크기: 모바일 h-[37px] → PC/TB h-11 (md: 기준)
 *
 * @example
 * <FilterButton label="문화 · 예술" icon={<IcArt />} state="normal" />
 *
 * @example
 * <FilterButton label="예약 완료" state="active" />
 *
 * @example
 * <FilterButton
 *   label="스포츠"
 *   icon={<IcSport />}
 *   state={selected ? 'active' : 'normal'}
 *   onClick={handleClick}
 * />
 */
export function FilterButton({
  label,
  icon,
  state = 'normal',
  className,
  ...rest
}: FilterButtonProps) {
  const styledIcon =
    icon && isValidElement(icon)
      ? cloneElement(
          icon as React.ReactElement<React.SVGProps<SVGSVGElement>>,
          {
            className: cn(
              (icon as React.ReactElement<React.SVGProps<SVGSVGElement>>).props
                .className,
              FILTER_ICON_CLASS
            ),
          }
        )
      : icon;

  return (
    <button
      type="button"
      className={cn(filterButtonVariants({ state }), className)}
      {...rest}
    >
      {styledIcon}
      <span>{label}</span>
    </button>
  );
}

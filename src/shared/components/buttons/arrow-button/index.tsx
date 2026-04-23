'use client';

import { ButtonHTMLAttributes } from 'react';
import {
  IcArrowLeft,
  IcArrowNaviLeft,
  IcArrowNaviRight,
  IcArrowRight,
} from '@/shared/assets/icons';
import { cn } from '@/shared/utils/cn';

export interface ArrowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * - `'arrow'` (기본값): 32×32 슬라이더·캐러셀용
   * - `'arrow_navigation'`: 40×40 페이지네이션용
   */
  variant?: 'arrow' | 'arrow_navigation';
  /** 화살표 방향 */
  direction: 'left' | 'right';
}

/**
 * 슬라이더·페이지네이션 이전/다음 이동에 사용하는 화살표 버튼
 *
 * - `variant="arrow"` (기본값): 32×32 슬라이더·캐러셀용 (IcArrow)
 * - `variant="arrow_navigation"`: 40×40 페이지네이션용 (IcArrowNavi)
 * - 비활성 상태는 `disabled` 속성으로 제어
 *
 * @example
 * <ArrowButton direction="left" />
 * <ArrowButton direction="right" disabled={!hasNext} onClick={goNext} />
 * <ArrowButton variant="arrow_navigation" direction="left" disabled={page <= 1} onClick={prevPage} />
 * <ArrowButton variant="arrow_navigation" direction="right" disabled={page >= totalPages} onClick={nextPage} />
 */
export function ArrowButton({
  variant = 'arrow',
  direction,
  className,
  ...rest
}: ArrowButtonProps) {
  const isNavigation = variant === 'arrow_navigation';
  const Icon = isNavigation
    ? direction === 'left'
      ? IcArrowNaviLeft
      : IcArrowNaviRight
    : direction === 'left'
      ? IcArrowLeft
      : IcArrowRight;

  return (
    <button
      type="button"
      aria-label={direction === 'left' ? '이전' : '다음'}
      className={cn(
        'inline-flex cursor-pointer items-center justify-center transition-colors duration-200',
        'text-gray-800 hover:text-gray-600',
        'disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:text-gray-300',
        isNavigation ? 'h-10 w-10' : 'h-8 w-8',
        className
      )}
      {...rest}
    >
      <Icon
        className={cn('block shrink-0', isNavigation ? 'h-10 w-10' : 'h-8 w-8')}
      />
    </button>
  );
}

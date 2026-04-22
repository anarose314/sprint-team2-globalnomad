import { cva } from 'class-variance-authority';
import type { SkeletonProps } from '@/shared/components/skeleton/skeleton.types';
import { cn } from '@/shared/utils/cn';

const skeletonStyle = cva('bg-gray-100', {
  variants: {
    variant: {
      pulse: 'animate-pulse',
      shimmer: 'skeleton-shimmer overflow-hidden',
      none: '',
    },
    rounded: {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      full: 'rounded-full',
    },
    fullWidth: {
      true: 'w-full',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'pulse',
    rounded: 'md',
    fullWidth: false,
  },
});

/**
 * 스켈레톤 UI 컴포넌트
 *
 * `variant`, `rounded`, `width`, `height`, `fullWidth` props로
 * 텍스트 줄·아바타·이미지·카드 등 다양한 형태에 대응
 * 네이티브 `div` 속성(`data-*`, `onClick` 등)도 그대로 전달된다.
 *
 * @param props - {@link SkeletonProps}
 *
 * @example
 * // 텍스트 줄
 * <Skeleton height={16} className="w-3/4" />
 *
 * @example
 * // 원형 아바타
 * <Skeleton width={48} height={48} rounded="full" />
 *
 * @example
 * // 이미지 영역 (shimmer)
 * <Skeleton height={200} fullWidth variant="shimmer" rounded="xl" />
 *
 * @example
 * // 카드 조합
 * <div className="flex flex-col gap-2">
 *   <Skeleton height={160} fullWidth rounded="xl" variant="shimmer" />
 *   <Skeleton height={18} className="w-3/4" />
 *   <Skeleton height={14} className="w-1/2" />
 * </div>
 */
export function Skeleton({
  className,
  style,
  width,
  height,
  rounded,
  variant,
  fullWidth,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(skeletonStyle({ variant, rounded, fullWidth }), className)}
      style={{ width, height, ...style }}
      aria-hidden="true"
      {...props}
    />
  );
}

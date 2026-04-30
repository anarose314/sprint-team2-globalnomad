import { cva } from 'class-variance-authority';
import { StatusBadgeProps } from '@/shared/components/status-badge/statusBadge.types';
import { STATUS_TEXT } from '@/shared/constants/status.constants';
import { cn } from '@/shared/utils/cn';

const badgeStyle = cva(
  'typo-xs-semibold inline-flex h-6.5 w-15.25 items-center justify-center rounded-full select-none',
  {
    variants: {
      status: {
        canceled: 'bg-gray-100 text-gray-600',
        pending: 'bg-teal-100 text-teal-500',
        declined: 'bg-red-100 text-red-500',
        completed: 'bg-primary-100 text-primary-700',
        confirmed: 'bg-teal-200 text-teal-700',
      },
    },
    defaultVariants: {
      status: 'pending',
    },
  }
);

/**
 * 예약 및 체험의 진행 상태를 시각적으로 나타내는 뱃지 컴포넌트
 * 상태값(`status`)에 따라 사전에 정의된 배경색과 텍스트 색상이 자동으로 매핑됩니다.
 *
 * @example
 * // (예: '예약 완료' 뱃지)
 * <StatusBadge status="pending" />
 */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span className={cn(badgeStyle({ status }), className)}>
      {STATUS_TEXT[status]}
    </span>
  );
}

import { cva } from 'class-variance-authority';
import { StatusBadgeProps } from '@/shared/components/status-badge/statusBadge.types';
import { STATUS_TEXT } from '@/shared/constants/status.constants';
import { cn } from '@/shared/utils/cn';

const badgeStyle = cva(
  'typo-xs-semibold inline-flex h-6.5 w-15.25 items-center justify-center rounded-full select-none',
  {
    variants: {
      status: {
        cancelled: 'bg-gray-100 text-gray-600',
        completed: 'bg-teal-100 text-teal-500',
        rejected: 'bg-red-100 text-red-500',
        attended: 'bg-primary-100 text-primary-700',
        approved: 'bg-teal-200 text-teal-700',
      },
    },
    defaultVariants: {
      status: 'completed',
    },
  }
);

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span className={cn(badgeStyle({ status }), className)}>
      {STATUS_TEXT[status]}
    </span>
  );
}

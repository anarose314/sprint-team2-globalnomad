import type { ActivitySectionStatusProps } from '@/app/(main)/components/activity-section-status/activitySectionStatus.types';
import { cn } from '@/shared/utils/cn';

/**
 * 메인 페이지 체험 섹션 상태 메시지 컴포넌트
 *
 * - 에러와 빈 상태 메시지를 일관된 스타일로 표시한다.
 *
 * @example
 * <ActivitySectionStatus message="조건에 맞는 체험이 없습니다." />
 */
export function ActivitySectionStatus({
  message,
  tone = 'default',
  className,
}: ActivitySectionStatusProps) {
  return (
    <p
      className={cn(
        'typo-md-medium py-10 text-center',
        tone === 'error' ? 'text-red-500' : 'text-gray-500',
        className
      )}
    >
      {message}
    </p>
  );
}

import { cn } from '@/shared/utils/cn';

interface NotificationDotProps {
  isMuted: boolean;
}

/**
 * 날짜 셀 우측 상단의 예약 알림 점을 렌더링
 */
export function NotificationDot({ isMuted }: NotificationDotProps) {
  return (
    <>
      <span
        aria-hidden="true"
        className={cn(
          'reservation-status-calendar__notification-dot',
          isMuted && 'reservation-status-calendar__meta--muted'
        )}
      />
      <span className="sr-only">예약 있음</span>
    </>
  );
}

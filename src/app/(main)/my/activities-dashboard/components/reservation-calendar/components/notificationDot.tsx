interface NotificationDotProps {
  isMuted: boolean;
}

/**
 * 날짜 셀 우측 상단의 예약 알림 점을 렌더링
 */
export function NotificationDot({ isMuted }: NotificationDotProps) {
  return (
    <span
      className={`reservation-calendar__notification-dot ${isMuted ? 'reservation-calendar__meta--muted' : ''}`}
    />
  );
}

interface NotificationDotProps {
  isMuted: boolean;
}

/**
 * 날짜 셀 우측 상단의 예약 알림 점을 렌더링합니다.
 * 현재 월이 아닌 날짜에서는 감쇠 스타일을 적용합니다.
 */
export function NotificationDot({ isMuted }: NotificationDotProps) {
  return (
    <span
      className={`reservation-calendar__notification-dot ${isMuted ? 'reservation-calendar__meta--muted' : ''}`}
    />
  );
}

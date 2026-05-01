interface NotificationDotProps {
  isMuted: boolean;
}

/**
<<<<<<< HEAD
 * 날짜 셀 우측 상단의 예약 알림 점을 렌더링
=======
 * 날짜 셀 우측 상단의 예약 알림 점을 렌더링합니다.
 * 현재 월이 아닌 날짜에서는 감쇠 스타일을 적용합니다.
>>>>>>> a863ace (✨ Feat: 이벤트 배지 컴포넌트 구현 및 캘린더 UI 마크업)
 */
export function NotificationDot({ isMuted }: NotificationDotProps) {
  return (
    <span
      className={`reservation-calendar__notification-dot ${isMuted ? 'reservation-calendar__meta--muted' : ''}`}
    />
  );
}

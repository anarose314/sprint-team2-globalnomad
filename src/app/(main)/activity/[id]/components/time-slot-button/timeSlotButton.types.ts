import { ButtonHTMLAttributes } from 'react';
import { VariantProps } from 'class-variance-authority';
import { timeSlotVariants } from '@/app/(main)/activity/[id]/components/time-slot-button/timeSlotButton.constants';

export interface TimeSlotButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof timeSlotVariants> {
  /**
   * 시간 슬롯 선택 여부
   * `true`이면 primary-100 배경 + primary-500 테두리·텍스트로 표시
   * @defaultValue `false`
   */
  isActive?: boolean;
  /**
   * 내가 이미 예약한 시간대 여부
   * `true`이면 비활성화 스타일에 '내 예약' 표시가 추가된다.
   * @defaultValue `false`
   */
  isMine?: boolean;
}

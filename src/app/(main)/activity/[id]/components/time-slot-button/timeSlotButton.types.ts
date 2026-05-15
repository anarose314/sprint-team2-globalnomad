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
}

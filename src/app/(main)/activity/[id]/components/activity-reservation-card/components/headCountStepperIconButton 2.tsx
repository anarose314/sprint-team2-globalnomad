'use client';

import {
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  useState,
} from 'react';
import {
  HEAD_COUNT_STEPPER_ICON_BUTTON_CLASS,
  HEAD_COUNT_STEPPER_PRESSED_ADDON_CLASS,
} from '@/app/(main)/activity/[id]/components/activity-reservation-card/headCountStepper.constants';
import { cn } from '@/shared/utils/cn';

export type HeadCountStepperIconButtonProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  'type'
> & {
  children: ReactNode;
};

/**
 * :active만으로는 눌림 구간이 짧아 transform이 거의 진행되지 않는 경우가 많아
 * pointer / 키보드 기준으로 pressed를 유지해 눌림 피드백이 보이도록 함
 */
export function HeadCountStepperIconButton({
  children,
  className,
  disabled,
  onPointerDown,
  onPointerUp,
  onPointerLeave,
  onPointerCancel,
  onKeyDown,
  onKeyUp,
  onBlur,
  ...rest
}: HeadCountStepperIconButtonProps) {
  const [pressed, setPressed] = useState(false);

  const endPress = () => setPressed(false);

  const handlePointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    if (!disabled && (e.pointerType !== 'mouse' || e.button === 0)) {
      setPressed(true);
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // setPointerCapture는 일부 환경에서 실패할 수 있음
      }
    }
    onPointerDown?.(e);
  };

  const releaseCapture = (el: HTMLButtonElement, pointerId: number) => {
    try {
      if (el.hasPointerCapture(pointerId)) {
        el.releasePointerCapture(pointerId);
      }
    } catch {
      // ignore
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(e);
    if (disabled || e.repeat) return;
    if (e.key === ' ' || e.key === 'Enter') {
      setPressed(true);
    }
  };

  const handleKeyUp = (e: KeyboardEvent<HTMLButtonElement>) => {
    onKeyUp?.(e);
    if (e.key === ' ' || e.key === 'Enter') {
      endPress();
    }
  };

  return (
    <button
      type="button"
      {...rest}
      disabled={disabled}
      className={cn(
        HEAD_COUNT_STEPPER_ICON_BUTTON_CLASS,
        !disabled && pressed && HEAD_COUNT_STEPPER_PRESSED_ADDON_CLASS,
        className
      )}
      onPointerDown={handlePointerDown}
      onPointerUp={(e) => {
        endPress();
        releaseCapture(e.currentTarget, e.pointerId);
        onPointerUp?.(e);
      }}
      onPointerLeave={onPointerLeave}
      onPointerCancel={(e) => {
        endPress();
        releaseCapture(e.currentTarget, e.pointerId);
        onPointerCancel?.(e);
      }}
      onLostPointerCapture={endPress}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onBlur={(e) => {
        endPress();
        onBlur?.(e);
      }}
    >
      {children}
    </button>
  );
}

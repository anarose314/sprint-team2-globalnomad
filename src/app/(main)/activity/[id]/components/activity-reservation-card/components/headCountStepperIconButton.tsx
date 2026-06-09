'use client';

import {
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  useState,
} from 'react';
import { cn } from '@/shared/utils/cn';

/** 24×24 원형 히트, 호버 시 SVG에만 drop-shadow (box-shadow는 사각 박스 느낌) */
const STEP_ICON_BUTTON_CLASS =
  'inline-flex h-6 w-6 shrink-0 cursor-pointer select-none items-center justify-center rounded-full ' +
  'text-gray-800 transition-[transform,filter] duration-100 ease-out ' +
  'enabled:hover:-translate-y-px enabled:hover:[&_svg]:drop-shadow-sm ' +
  'motion-reduce:enabled:hover:translate-y-0 motion-reduce:enabled:hover:[&_svg]:drop-shadow-none';

/** pointer down / Space·Enter hold 동안만 `cn(STEP_ICON_BUTTON_CLASS, …)`에 병합 */
const STEP_ICON_PRESSED_CLASS =
  'translate-y-px scale-90 duration-75 [&_svg]:drop-shadow-none ease-in ' +
  'motion-reduce:translate-y-0 motion-reduce:scale-100';

export type HeadCountStepperIconButtonProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  'type'
> & {
  /** 아이콘 버튼 접근성 이름(스크린리더 전용) */
  'aria-label': string;
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
        STEP_ICON_BUTTON_CLASS,
        !disabled && pressed && STEP_ICON_PRESSED_CLASS,
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

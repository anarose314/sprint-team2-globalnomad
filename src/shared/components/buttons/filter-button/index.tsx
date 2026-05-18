'use client';

import {
  cloneElement,
  isValidElement,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  FILTER_BUTTON_PRESS_ANIMATE_CLASS,
  FILTER_ICON_CLASS,
  filterButtonVariants,
} from '@/shared/components/buttons/filter-button/filterButton.constants';
import type { FilterButtonProps } from '@/shared/components/buttons/filter-button/filterButton.types';
import { cn } from '@/shared/utils/cn';

export type { FilterButtonProps } from '@/shared/components/buttons/filter-button/filterButton.types';

const PRESS_ANIM_DEBOUNCE_MS = 55;

/**
 * pill 형태의 필터·토글용 버튼
 *
 * - `state="normal"` : 흰 배경 + 회색 테두리
 * - `state="active"` : 검정 배경 + 흰 텍스트(테두리는 배경색과 동일하게 유지해 폭이 바뀌지 않음)
 * - 반응형 크기: 모바일 h-[37px] → PC/TB h-11 (md: 기준)
 * - 눌림 피드백은 짧은 CSS 키프레임으로 처리한다. 클래스는 React `className`에 포함해 부모 리렌더 후에도 유지되며,
 *   맥 탭 투 클릭 대비로 `mousedown`/`pointerdown`/`click`에서 모두 트리거한다.
 *
 * @example
 * <FilterButton label="문화 · 예술" icon={<IcArt />} state="normal" />
 *
 * @example
 * <FilterButton label="예약 완료" state="active" />
 *
 * @example
 * <FilterButton
 *   label="스포츠"
 *   icon={<IcSport />}
 *   state={selected ? 'active' : 'normal'}
 *   onClick={handleClick}
 * />
 */
export function FilterButton({
  label,
  icon,
  state = 'normal',
  className,
  disabled,
  onClick,
  onMouseDown,
  onPointerDown,
  onAnimationEnd,
  ...rest
}: FilterButtonProps) {
  const rootRef = useRef<HTMLButtonElement>(null);
  const lastPressAnimAt = useRef(0);
  const [pressToken, setPressToken] = useState(0);

  const styledIcon = useMemo(() => {
    if (!icon || !isValidElement(icon)) {
      return icon;
    }

    const iconElement = icon as React.ReactElement<{ className?: string }>;

    return cloneElement(iconElement, {
      className: cn(iconElement.props.className, FILTER_ICON_CLASS),
    });
  }, [icon]);

  const bumpPressAnimation = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const now = performance.now();
    if (now - lastPressAnimAt.current < PRESS_ANIM_DEBOUNCE_MS) {
      return;
    }
    lastPressAnimAt.current = now;

    setPressToken((t) => t + 1);
  }, []);

  useLayoutEffect(() => {
    if (pressToken === 0) {
      return;
    }

    const el = rootRef.current;
    if (!el) {
      return;
    }

    el.classList.remove(FILTER_BUTTON_PRESS_ANIMATE_CLASS);
    void el.offsetWidth;
    el.classList.add(FILTER_BUTTON_PRESS_ANIMATE_CLASS);
  }, [pressToken]);

  const handlePressGesture = useCallback(
    (e: React.MouseEvent | React.PointerEvent) => {
      if (disabled || e.button !== 0) {
        return;
      }
      bumpPressAnimation();
    },
    [disabled, bumpPressAnimation]
  );

  return (
    <button
      {...rest}
      ref={rootRef}
      type="button"
      disabled={disabled}
      className={cn(
        filterButtonVariants({ state }),
        pressToken > 0 && FILTER_BUTTON_PRESS_ANIMATE_CLASS,
        className
      )}
      onPointerDown={(e) => {
        onPointerDown?.(e);
        if (e.defaultPrevented) {
          return;
        }
        handlePressGesture(e);
      }}
      onMouseDown={(e) => {
        onMouseDown?.(e);
        if (e.defaultPrevented) {
          return;
        }
        handlePressGesture(e);
      }}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || disabled) {
          return;
        }
        bumpPressAnimation();
      }}
      onAnimationEnd={(e) => {
        if (e.animationName === 'filter-button-press') {
          setPressToken(0);
        }
        onAnimationEnd?.(e);
      }}
    >
      {styledIcon}
      <span>{label}</span>
    </button>
  );
}

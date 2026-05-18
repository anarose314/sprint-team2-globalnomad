'use client';

import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
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
 *   포인터 입력은 `onPointerDown`에서만, 키보드(스페이스/엔터) 활성화는 `onClick`에서만 트리거해 중복 실행 방어
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
  onPointerDown,
  onPointerUp,
  onPointerLeave,
  onAnimationEnd,
  ...rest
}: FilterButtonProps) {
  const rootRef = useRef<HTMLButtonElement>(null);
  const lastPressAnimAt = useRef(0);
  const suppressNextClickBumpRef = useRef(false);
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

  useEffect(() => {
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
        if (e.defaultPrevented || disabled || e.button !== 0) {
          return;
        }
        suppressNextClickBumpRef.current = true;
        bumpPressAnimation();
      }}
      onPointerUp={(e) => {
        onPointerUp?.(e);
        window.setTimeout(() => {
          if (suppressNextClickBumpRef.current) {
            suppressNextClickBumpRef.current = false;
          }
        }, 0);
      }}
      onPointerLeave={(e) => {
        onPointerLeave?.(e);
        suppressNextClickBumpRef.current = false;
      }}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || disabled) {
          suppressNextClickBumpRef.current = false;
          return;
        }
        if (suppressNextClickBumpRef.current) {
          suppressNextClickBumpRef.current = false;
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

'use client';

import { cloneElement, isValidElement } from 'react';
import {
  BUTTON_VARIANTS,
  ICON_SIZE_CLASS,
} from '@/shared/components/buttons/button/button.constants';
import type {
  ButtonProps,
  PrimaryButtonProps,
  SecondaryButtonProps,
} from '@/shared/components/buttons/button/button.types';
import { cn } from '@/shared/utils/cn';

export type { ButtonProps };

/**
 * 프로젝트 전반에서 사용하는 버튼 컴포넌트
 * `variant` prop으로 버튼 종류를 선택
 *
 * ---
 *
 * ### `variant="primary"` (기본값)
 * 주요 액션에 사용하는 채움 버튼
 * - 색상: primary-500 배경 + 흰 텍스트
 * - disabled 시 gray-200 배경
 *
 * @example
 * <Button size="lg" onClick={handleSubmit}>날짜 선택하기</Button>
 *
 * ---
 *
 * ### `variant="secondary"`
 * 보조 액션에 사용하는 테두리 버튼
 * - 색상: 흰 배경 + gray-200 테두리
 * - 클릭 시 primary-500 배경으로 전환
 *
 * @example
 * <Button variant="secondary" size="lg">취소</Button>
 * <Button variant="secondary" size="sm" icon={<IcEdit />}>수정</Button>
 */
export function Button(props: ButtonProps) {
  const { variant = 'primary', icon, className, children, ...rest } = props;

  const resolvedSize =
    (rest as PrimaryButtonProps | SecondaryButtonProps).size ?? 'lg';
  const iconClass = ICON_SIZE_CLASS[resolvedSize];

  const styledIcon =
    icon && isValidElement(icon)
      ? cloneElement(
          icon as React.ReactElement<React.SVGProps<SVGSVGElement>>,
          {
            className: cn(
              (icon as React.ReactElement<React.SVGProps<SVGSVGElement>>).props
                .className,
              'block shrink-0'
            ),
            style: { display: 'block', flexShrink: 0 },
          }
        )
      : icon;

  /* ── Secondary Button ── */
  if (variant === 'secondary') {
    const { size, ...buttonRest } = rest as SecondaryButtonProps;

    return (
      <button
        className={cn(
          BUTTON_VARIANTS({ variant: 'secondary', size }),
          className
        )}
        {...buttonRest}
      >
        {styledIcon && (
          <span
            className={cn(
              'flex shrink-0 items-center justify-center',
              iconClass
            )}
          >
            {styledIcon}
          </span>
        )}
        <span className="truncate">{children}</span>
      </button>
    );
  }

  /* ── Primary Button ── */
  const { size, ...buttonRest } = rest as PrimaryButtonProps;

  return (
    <button
      className={cn(BUTTON_VARIANTS({ variant: 'primary', size }), className)}
      {...buttonRest}
    >
      {styledIcon && (
        <span
          className={cn('flex shrink-0 items-center justify-center', iconClass)}
        >
          {styledIcon}
        </span>
      )}
      <span className="truncate">{children}</span>
    </button>
  );
}

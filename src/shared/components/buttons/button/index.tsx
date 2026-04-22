'use client';

import { cloneElement, isValidElement } from 'react';
import {
  IcArrowLeft,
  IcArrowNaviLeft,
  IcArrowNaviRight,
  IcArrowRight,
  IcPlus,
} from '@/shared/assets/icons';
import {
  buttonVariants,
  ICON_SIZE_CLASS,
} from '@/shared/components/buttons/button/button.constants';
import type {
  ButtonProps,
  PrimaryButtonProps,
  SecondaryButtonProps,
  TextButtonProps,
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
 *
 * ---
 *
 * ### `variant="text"`
 * 사이드바에 사용하는 텍스트 버튼
 * - 고정 너비 115px, 왼쪽 정렬
 * - `isActive`로 선택 상태(primary-100 배경) 표현
 *
 * @example
 * <Button variant="text" size="lg" icon={<IcUser />} isActive>내 정보</Button>
 * <Button variant="text" size="sm" icon={<IcCalendar />}>예약 내역</Button>
 *
 * ---
 *
 * ### `variant="arrow"`
 * 슬라이더·캐러셀 이전/다음 이동에 사용하는 32×32 화살표 버튼
 * - `isActive=false`이면 gray-300(비활성) 색상으로 표시
 *
 * @example
 * <Button variant="arrow" direction="left" isActive />
 * <Button variant="arrow" direction="right" isActive={hasNext} onClick={goNext} />
 *
 * ---
 *
 * ### `variant="arrow_navigation"`
 * 페이지네이션 이전/다음에 사용하는 40×40 화살표 버튼
 *
 * @example
 * <Button variant="arrow_navigation" direction="left" isActive={page > 1} onClick={prevPage} />
 * <Button variant="arrow_navigation" direction="right" isActive={page < totalPages} onClick={nextPage} />
 *
 * ---
 *
 * ### `variant="btn_add"`
 * 이미지 등록 영역에 사용하는 정사각형 버튼
 * - `size="pc"` : 128×128 고정
 * - `size="mb"` : 80×80 고정
 * - `size` 미지정 : 반응형 (기본 80×80 → md 이상 128×128)
 *
 * @example
 * <Button variant="btn_add" size="pc" onClick={openFilePicker} />
 * <Button variant="btn_add" size="mb" />
 * <Button variant="btn_add" />
 */
export function Button(props: ButtonProps) {
  if (props.variant === 'btn_add') {
    const { size, className, ...rest } = props;

    const isPC = size === 'pc';
    const isMB = size === 'mb';
    const responsive = !isPC && !isMB;

    return (
      <button
        type="button"
        className={cn(
          'group inline-flex cursor-pointer flex-col items-center',
          'rounded-2xl border border-gray-100 bg-white',
          'transition-colors duration-200 hover:border-gray-300',
          isPC && 'h-32 w-32 gap-2 pt-8 pb-8',
          isMB && 'h-20 w-20 gap-1 pt-[15px] pb-[15px]',
          responsive &&
            'h-20 w-20 gap-1 pt-[15px] pb-[15px] md:h-32 md:w-32 md:gap-2 md:pt-8 md:pb-8',
          className
        )}
        {...rest}
      >
        {isPC && (
          <IcPlus
            width={40}
            height={40}
            className="shrink-0 text-gray-400 transition-colors duration-200 group-hover:text-gray-600"
            style={{ display: 'block' }}
          />
        )}
        {isMB && (
          <IcPlus
            width={30}
            height={30}
            className="shrink-0 text-gray-400 transition-colors duration-200 group-hover:text-gray-600"
            style={{ display: 'block' }}
          />
        )}
        {responsive && (
          <span className="block h-[30px] w-[30px] shrink-0 text-gray-400 transition-colors duration-200 group-hover:text-gray-600 md:h-10 md:w-10">
            <IcPlus width="100%" height="100%" style={{ display: 'block' }} />
          </span>
        )}
        <span
          className={cn(
            'leading-4 font-medium text-gray-400 transition-colors duration-200 group-hover:text-gray-600',
            isPC && 'text-md',
            isMB && 'text-xs',
            responsive && 'md:text-md text-xs'
          )}
        >
          이미지 등록
        </span>
      </button>
    );
  }

  if (props.variant === 'arrow') {
    const { direction, isActive = true, className, ...rest } = props;
    const Icon = direction === 'left' ? IcArrowLeft : IcArrowRight;
    return (
      <button
        type="button"
        className={cn(
          'inline-flex cursor-pointer items-center justify-center transition-colors duration-200 disabled:cursor-not-allowed disabled:text-gray-300',
          isActive
            ? 'text-gray-800 hover:text-gray-600'
            : 'text-gray-300 hover:text-gray-600',
          className
        )}
        style={{ width: 32, height: 32 }}
        {...rest}
      >
        <Icon
          style={{ width: 32, height: 32, display: 'block', flexShrink: 0 }}
        />
      </button>
    );
  }

  if (props.variant === 'arrow_navigation') {
    const { direction, isActive = true, className, ...rest } = props;
    const Icon = direction === 'left' ? IcArrowNaviLeft : IcArrowNaviRight;
    return (
      <button
        type="button"
        className={cn(
          'inline-flex cursor-pointer items-center justify-center transition-colors duration-200 disabled:cursor-not-allowed disabled:text-gray-300',
          isActive
            ? 'text-gray-800 hover:text-gray-600'
            : 'text-gray-300 hover:text-gray-600',
          className
        )}
        style={{ width: 40, height: 40 }}
        {...rest}
      >
        <Icon
          style={{ width: 40, height: 40, display: 'block', flexShrink: 0 }}
        />
      </button>
    );
  }

  const { variant = 'primary', icon, className, children, ...rest } = props;

  const resolvedSize =
    (rest as PrimaryButtonProps | SecondaryButtonProps | TextButtonProps)
      .size ?? 'lg';
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

  /* ── Text Button ── */
  if (variant === 'text') {
    const { size, isActive, ...buttonRest } = rest as TextButtonProps;

    return (
      <button
        className={cn(
          buttonVariants({ variant: 'text', size }),
          isActive
            ? 'bg-primary-100 text-gray-900'
            : 'hover:bg-primary-100 bg-transparent text-gray-600 hover:text-black/20',
          className
        )}
        {...buttonRest}
      >
        {styledIcon && (
          <span
            className={cn(
              'flex shrink-0 items-center justify-center transition-colors duration-200',
              iconClass,
              isActive
                ? 'text-primary-500'
                : 'group-hover:text-primary-500 text-gray-600'
            )}
          >
            {styledIcon}
          </span>
        )}
        <span>{children}</span>
      </button>
    );
  }

  /* ── Secondary Button ── */
  if (variant === 'secondary') {
    const { size, ...buttonRest } = rest as SecondaryButtonProps;

    return (
      <button
        className={cn(
          buttonVariants({ variant: 'secondary', size }),
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
      className={cn(buttonVariants({ variant: 'primary', size }), className)}
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

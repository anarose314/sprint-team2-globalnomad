'use client';

import {
  ButtonHTMLAttributes,
  cloneElement,
  isValidElement,
  ReactNode,
  SVGProps,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  IcArrowLeft,
  IcArrowNaviLeft,
  IcArrowNaviRight,
  IcArrowRight,
  IcArt,
  IcBus,
  IcFood,
  IcPlus,
  IcSport,
  IcTour,
  IcWellbeing,
} from '@/shared/assets/icons';
import { cn } from '@/shared/utils/cn';

/* ─────────────────────────────── Shared Base ─────────────────────────────── */

const baseClass =
  'inline-flex items-center justify-center gap-1 [letter-spacing:-0.025em] cursor-pointer transition-colors duration-200 disabled:cursor-not-allowed';

/* ─────────────────────────────── Primary Size Variants ─────────────────────────────── */

const primarySizeVariants = cva('font-bold', {
  variants: {
    size: {
      lg: 'h-[54px] rounded-2xl px-10 py-[14px] text-lg',
      md: 'h-12 rounded-[14px] px-10 py-[14px] text-lg',
      sm: 'text-md h-[41px] rounded-xl px-10 py-3',
    },
  },
  defaultVariants: { size: 'lg' },
});

/* ─────────────────────────────── Secondary Size Variants ─────────────────────────────── */

const secondarySizeVariants = cva('border border-gray-200 font-medium', {
  variants: {
    size: {
      lg: 'h-[54px] rounded-2xl px-10 py-[14px] text-lg',
      md: 'h-12 rounded-[14px] px-10 py-[14px] text-lg',
      sm: 'text-md h-[34px] rounded-[12px] px-5 py-1',
    },
  },
  defaultVariants: { size: 'lg' },
});

/* ─────────────────────────────── Text Size Variants ─────────────────────────────── */

const textSizeVariants = cva('font-medium', {
  variants: {
    size: {
      /* width 115, padding-left 20(pl-5) / padding-right 40(pr-10) */
      lg: 'h-[54px] w-[115px] gap-2 rounded-2xl py-3 pr-10 pl-5 text-lg',
      md: 'h-12 w-[115px] gap-2 rounded-[14px] py-[14px] pr-10 pl-5 text-lg',
      sm: 'text-md h-[41px] w-[115px] gap-[5px] rounded-[12px] py-3 pr-10 pl-5',
    },
  },
  defaultVariants: { size: 'lg' },
});

const ICON_PX_SIZE: Record<'lg' | 'md' | 'sm', number> = {
  lg: 24,
  md: 20,
  sm: 16,
};

/* ─────────────────────────────── Types ─────────────────────────────── */

interface BaseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼 왼쪽에 표시할 아이콘 */
  icon?: ReactNode;
}

interface PrimaryButtonProps
  extends BaseButtonProps, VariantProps<typeof primarySizeVariants> {
  variant?: 'primary';
  isActive?: never;
}

interface SecondaryButtonProps
  extends BaseButtonProps, VariantProps<typeof secondarySizeVariants> {
  variant: 'secondary';
  isActive?: never;
}

interface TextButtonProps
  extends BaseButtonProps, VariantProps<typeof textSizeVariants> {
  variant: 'text';
  /** 버튼 선택 여부 */
  isActive?: boolean;
}

interface ArrowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'arrow';
  /** 화살표 방향 */
  direction: 'left' | 'right';
  /** 활성 여부 — true: gray_800 / false: gray_300 */
  isActive?: boolean;
}

interface ArrowNavigationButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'arrow_navigation';
  /** 화살표 방향 */
  direction: 'left' | 'right';
  /** 활성 여부 — true: gray_800 / false: gray_300 */
  isActive?: boolean;
}

interface AddButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'btn_add';
  /**
   * - `'pc'`: PC/TB 사이즈 (128×128) 고정
   * - `'mb'`: 모바일 사이즈 (80×80) 고정
   * - `undefined`: 반응형 (기본 80×80, md: 이상 128×128)
   */
  size?: 'pc' | 'mb';
}

export type ButtonProps =
  | PrimaryButtonProps
  | SecondaryButtonProps
  | TextButtonProps
  | ArrowButtonProps
  | ArrowNavigationButtonProps
  | AddButtonProps;

/* ─────────────────────────────── Filter Button ─────────────────────────────── */

type CategoryIconComponent = React.FC<SVGProps<SVGSVGElement>>;

const CATEGORY_ICON_MAP = {
  art: IcArt,
  food: IcFood,
  bus: IcBus,
  sport: IcSport,
  tour: IcTour,
  wellbeing: IcWellbeing,
} satisfies Record<string, CategoryIconComponent>;

/** 카테고리 필터 버튼에 사용 가능한 카테고리 종류 */
export type FilterCategory = keyof typeof CATEGORY_ICON_MAP;

const filterButtonVariants = cva(
  'inline-flex cursor-pointer items-center justify-center rounded-full transition-all duration-200',
  {
    variants: {
      state: {
        normal:
          'border border-[#D8D8D8] bg-white font-medium text-gray-950 hover:border-transparent hover:bg-[#333333] hover:font-bold hover:text-white',
        active: 'bg-[#333333] font-bold text-white',
      },
      size: {
        pc: 'h-11 gap-1.5 px-4 py-[10px] text-lg',
        mb: 'text-md h-[37px] gap-1 px-[14px] py-[10px]',
      },
    },
    defaultVariants: {
      state: 'normal',
      size: 'pc',
    },
  }
);

const FILTER_ICON_SIZE: Record<'pc' | 'mb', number> = { pc: 24, mb: 16 };

interface FilterButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof filterButtonVariants> {
  /** 버튼에 표시할 텍스트 레이블 */
  label: string;
  /**
   * 카테고리 종류
   * - `'art'` : 아트/문화
   * - `'food'` : 음식/음료
   * - `'bus'` : 버스/투어
   * - `'sport'` : 스포츠
   * - `'tour'` : 관광
   * - `'wellbeing'` : 웰빙
   */
  category?: FilterCategory;
  /**
   * 아이콘 표시 여부
   * @defaultValue `true`
   */
  showIcon?: boolean;
}

/**
 * 홈 화면 카테고리 필터링에 사용하는 pill 형태 버튼
 *
 * - `state="normal"` : 흰 배경 + 회색 테두리
 * - `state="active"` : 검정 배경 + 흰 텍스트
 * - `size="pc"` : PC/TB (h-44, 아이콘 24×24)
 * - `size="mb"` : 모바일 (h-37, 아이콘 16×16)
 *
 * @example
 * // 기본 사용 (아이콘 포함)
 * <FilterButton label="아트" category="art" state="normal" size="pc" />
 *
 * @example
 * // 선택된 상태
 * <FilterButton label="음식" category="food" state="active" size="mb" />
 *
 * @example
 * // 아이콘 없이 텍스트만 표시
 * <FilterButton label="전체" showIcon={false} state="normal" size="pc" />
 *
 * @example
 * // 클릭 이벤트 연결
 * <FilterButton
 *   label="스포츠"
 *   category="sport"
 *   state={selected === 'sport' ? 'active' : 'normal'}
 *   size="pc"
 *   onClick={() => setSelected('sport')}
 * />
 */
export function FilterButton({
  label,
  category,
  showIcon = true,
  state = 'normal',
  size = 'pc',
  className,
  ...rest
}: FilterButtonProps) {
  const IconComponent = category ? CATEGORY_ICON_MAP[category] : IcArt;
  const iconSize = FILTER_ICON_SIZE[size ?? 'pc'];

  return (
    <button
      type="button"
      className={cn(filterButtonVariants({ state, size }), className)}
      {...rest}
    >
      {showIcon && (
        <IconComponent
          width={iconSize}
          height={iconSize}
          className="block shrink-0"
        />
      )}
      <span>{label}</span>
    </button>
  );
}

/* ─────────────────────────────── Time Slot Button ─────────────────────────────── */

const timeSlotVariants = cva(
  'inline-flex w-full cursor-pointer items-center justify-center rounded-[11px] border font-medium transition-colors duration-200',
  {
    variants: {
      /**
       * - `'pc'` : 350×54 (border 포함), text-16px
       * - `'tb'` : 253×54 (border 포함), text-14px
       * - `'mb'` : 327×48 (border 포함), text-14px
       */
      size: {
        pc: 'h-[54px] px-3 text-lg',
        tb: 'text-md h-[54px] px-3',
        mb: 'text-md h-[48px] px-3',
      },
    },
    defaultVariants: { size: 'pc' },
  }
);

interface TimeSlotButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof timeSlotVariants> {
  /**
   * 시간 슬롯 선택 여부.
   * `true`이면 primary-100 배경 + primary-500 테두리·텍스트로 표시됩니다.
   * @defaultValue `false`
   */
  isActive?: boolean;
}

/**
 * 예약 가능한 시간대 선택 버튼
 *
 * 버튼 내부 텍스트(시간 범위)는 API에서 받아온 값을 `children`으로 전달
 * 가능한 시간대만 렌더링하므로 `disabled` 상태는 제공하지 않는다.
 *
 * - 기본 상태 : 흰 배경 + gray-300 테두리 (hover 시 primary 계열로 전환)
 * - 선택 상태(`isActive`) : primary-100 배경 + primary-500 테두리·텍스트
 * - `size="pc"` : 350×54 (border 포함)
 * - `size="tb"` : 253×54 (border 포함)
 * - `size="mb"` : 327×48 (border 포함)
 *
 * @example
 * // 기본 사용
 * <TimeSlotButton size="pc">14:00 ~ 15:00</TimeSlotButton>
 *
 * @example
 * // 선택된 상태
 * <TimeSlotButton size="mb" isActive>15:00 ~ 16:00</TimeSlotButton>
 *
 * @example
 * // API 데이터로 시간 슬롯 목록 렌더링
 * {timeSlots.map((slot) => (
 *   <TimeSlotButton
 *     key={slot.id}
 *     size="pc"
 *     isActive={selectedId === slot.id}
 *     onClick={() => setSelectedId(slot.id)}
 *   >
 *     {slot.startTime} ~ {slot.endTime}
 *   </TimeSlotButton>
 * ))}
 */
export function TimeSlotButton({
  size = 'pc',
  isActive = false,
  className,
  children,
  ...rest
}: TimeSlotButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        timeSlotVariants({ size }),
        isActive
          ? 'border-primary-500 bg-primary-100 text-primary-500'
          : 'hover:border-primary-500 hover:bg-primary-100 hover:text-primary-500 border-gray-300 bg-white text-gray-950',
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

/* ─────────────────────────────── Button ─────────────────────────────── */

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
 * 슬라이더·캐러셀 이전/다음 이동에 사용하는 32×32 화살표 버튼입니다.
 * - `isActive=false`이면 gray-300(비활성) 색상으로 표시
 *
 * @example
 * <Button variant="arrow" direction="left" isActive />
 * <Button variant="arrow" direction="right" isActive={hasNext} onClick={goNext} />
 *
 * ---
 *
 * ### `variant="arrow_navigation"`
 * 페이지네이션 이전/다음에 사용하는 40×40 화살표 버튼입니다.
 *
 * @example
 * <Button variant="arrow_navigation" direction="left" isActive={page > 1} onClick={prevPage} />
 * <Button variant="arrow_navigation" direction="right" isActive={page < totalPages} onClick={nextPage} />
 *
 * ---
 *
 * ### `variant="btn_add"`
 * 이미지 등록 영역에 사용하는 정사각형 버튼입니다.
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
            className="block shrink-0 text-gray-400 transition-colors duration-200 group-hover:text-gray-600"
          />
        )}
        {isMB && (
          <IcPlus
            width={30}
            height={30}
            className="block shrink-0 text-gray-400 transition-colors duration-200 group-hover:text-gray-600"
          />
        )}
        {responsive && (
          <span className="block h-[30px] w-[30px] shrink-0 text-gray-400 transition-colors duration-200 group-hover:text-gray-600 md:h-10 md:w-10">
            <IcPlus width="100%" height="100%" className="block" />
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
          'inline-flex h-8 w-8 cursor-pointer items-center justify-center transition-colors duration-200 disabled:cursor-not-allowed disabled:text-gray-300',
          isActive
            ? 'text-gray-800 hover:text-gray-600'
            : 'text-gray-300 hover:text-gray-600',
          className
        )}
        {...rest}
      >
        <Icon className="block h-8 w-8 shrink-0" />
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
          'inline-flex h-10 w-10 cursor-pointer items-center justify-center transition-colors duration-200 disabled:cursor-not-allowed disabled:text-gray-300',
          isActive
            ? 'text-gray-800 hover:text-gray-600'
            : 'text-gray-300 hover:text-gray-600',
          className
        )}
        {...rest}
      >
        <Icon className="block h-10 w-10 shrink-0" />
      </button>
    );
  }

  const { variant = 'primary', icon, className, children, ...rest } = props;

  const resolvedSize = rest.size ?? 'lg';
  const px = ICON_PX_SIZE[resolvedSize];

  const styledIcon =
    icon && isValidElement(icon)
      ? cloneElement(
          icon as React.ReactElement<React.SVGProps<SVGSVGElement>>,
          {
            className: cn(
              'block shrink-0',
              `min-w-[${px}px] w-[${px}px] h-[${px}px]`,
              (icon as React.ReactElement<{ className?: string }>).props
                .className
            ),
          }
        )
      : icon;

  /* ── Text Button ── */
  if (variant === 'text') {
    const { size, isActive, ...buttonRest } = rest as TextButtonProps;

    return (
      <button
        className={cn(
          baseClass,
          textSizeVariants({ size }),
          'group justify-start',
          isActive
            ? 'bg-primary-100 text-gray-900'
            : 'hover:bg-primary-100 bg-transparent text-gray-600 hover:text-black/20',
          'disabled:bg-transparent disabled:text-gray-300',
          className
        )}
        {...buttonRest}
      >
        {styledIcon && (
          <span
            className={cn(
              'flex shrink-0 items-center justify-center transition-colors duration-200',
              `min-w-[${px}px] w-[${px}px] h-[${px}px]`,
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
          baseClass,
          secondarySizeVariants({ size }),
          'bg-white text-gray-600',
          'hover:border-gray-300 hover:bg-gray-50',
          'active:scale-[0.98]',
          'active:bg-primary-500! active:border-0! active:text-white! active:shadow-none!',
          'disabled:scale-100 disabled:bg-white disabled:text-gray-200 disabled:shadow-none',
          className
        )}
        {...buttonRest}
      >
        {styledIcon && (
          <span
            className={cn(
              'flex shrink-0 items-center justify-center',
              `min-w-[${px}px] w-[${px}px] h-[${px}px]`
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
      className={cn(
        baseClass,
        primarySizeVariants({ size }),
        'bg-primary-500 text-white',
        'hover:bg-primary-500/80 hover:shadow-md',
        'active:bg-primary-700 active:scale-[0.98]',
        'disabled:scale-100 disabled:bg-gray-200 disabled:text-gray-50 disabled:shadow-none',
        className
      )}
      {...buttonRest}
    >
      {styledIcon && (
        <span
          className={cn(
            'flex shrink-0 items-center justify-center',
            `min-w-[${px}px] w-[${px}px] h-[${px}px]`
          )}
        >
          {styledIcon}
        </span>
      )}
      <span className="truncate">{children}</span>
    </button>
  );
}

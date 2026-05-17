import { cva } from 'class-variance-authority';

export const BASE_CLASS =
  'inline-flex items-center justify-center gap-1 [letter-spacing:-0.025em] cursor-pointer select-none ' +
  'transition-[color,background-color,border-color,box-shadow,transform] duration-200 ease-out ' +
  'motion-reduce:transition-colors motion-reduce:duration-150 ' +
  'motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-none motion-reduce:active:!scale-100 ' +
  'disabled:cursor-not-allowed';

/**
 * primary / secondary 두 variant 와 lg / md / sm size 를
 * variants 조합으로 처리하는 단일 CVA
 *
 * - height는 size별로 통일: lg=54px / md=48px / sm=40px
 * - 수직 정렬은 items-center + justify-center 에서 담당하므로 py 없음
 * - 좌우 패딩은 px-em 으로 폰트 크기에 비례하여 자동 조정
 */
export const BUTTON_VARIANTS = cva(BASE_CLASS, {
  variants: {
    variant: {
      primary: [
        'bg-primary-500 font-bold text-white',
        'enabled:hover:bg-primary-500/80 enabled:hover:shadow-primary-500/25 enabled:hover:-translate-y-px enabled:hover:shadow-md',
        'enabled:active:bg-primary-700 enabled:active:shadow-primary-500/20 enabled:active:translate-y-0 enabled:active:scale-[0.98] enabled:active:shadow-sm',
        'disabled:bg-gray-200 disabled:text-gray-50',
      ],
      secondary: [
        'border border-gray-200 bg-white font-medium text-gray-600',
        'enabled:hover:-translate-y-px enabled:hover:border-gray-300 enabled:hover:bg-gray-50 enabled:hover:shadow-sm enabled:hover:shadow-gray-900/8',
        'enabled:active:translate-y-0 enabled:active:scale-[0.98] enabled:active:border-gray-400 enabled:active:bg-gray-400 enabled:active:text-white enabled:active:shadow-none',
        'aria-pressed:border-primary-500 aria-pressed:bg-primary-500 aria-pressed:text-white',
        'enabled:aria-pressed:hover:border-primary-500 enabled:aria-pressed:hover:bg-primary-500',
        'disabled:border-gray-200 disabled:bg-white disabled:text-gray-200',
        'disabled:aria-pressed:border-gray-200 disabled:aria-pressed:bg-white disabled:aria-pressed:text-gray-200',
      ],
    },
    size: {
      lg: 'px-em h-13.5 rounded-2xl text-lg',
      md: 'px-em h-12 rounded-2xl text-lg',
      sm: 'text-md px-em h-10 rounded-xl',
    },
  },
  defaultVariants: { variant: 'primary', size: 'lg' },
});

/**
 * 아이콘 크기별 Tailwind 클래스 맵
 * 동적 문자열(`w-[${px}px]`) 대신 정적 클래스를 사용해 빌드 시점 purge 오류를 방지
 */
export const ICON_SIZE_CLASS: Record<'lg' | 'md' | 'sm', string> = {
  lg: 'min-w-6 w-6 h-6',
  md: 'min-w-5 w-5 h-5',
  sm: 'min-w-4 w-4 h-4',
};

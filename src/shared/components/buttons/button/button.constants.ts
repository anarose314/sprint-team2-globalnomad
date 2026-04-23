import { cva } from 'class-variance-authority';

export const BASE_CLASS =
  'inline-flex items-center justify-center gap-1 [letter-spacing:-0.025em] cursor-pointer transition-colors duration-200 disabled:cursor-not-allowed';

/**
 * primary / secondary 두 variant 와 lg / md / sm size 를
 * variants 조합으로 처리하는 단일 CVA
 *
 * - height는 size별로 통일: lg=54px / md=48px / sm=40px
 * - 수직 정렬은 items-center + justify-center 에서 담당하므로 py 없음
 * - 좌우 패딩은 px-[1em] 으로 폰트 크기에 비례하여 자동 조정
 */
export const BUTTON_VARIANTS = cva(BASE_CLASS, {
  variants: {
    variant: {
      primary:
        'bg-primary-500 hover:bg-primary-500/80 active:bg-primary-700 font-bold text-white hover:shadow-md active:scale-[0.98] disabled:scale-100 disabled:bg-gray-200 disabled:text-gray-50 disabled:shadow-none',
      secondary:
        'active:bg-primary-500! border border-gray-200 bg-white font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98] active:border-0! active:text-white! active:shadow-none! disabled:scale-100 disabled:bg-white disabled:text-gray-200 disabled:shadow-none',
    },
    size: {
      lg: 'h-[54px] rounded-2xl px-[1em] text-lg',
      md: 'h-12 rounded-[14px] px-[1em] text-lg',
      sm: 'text-md h-10 rounded-xl px-[1em]',
    },
  },
  defaultVariants: { variant: 'primary', size: 'lg' },
});

/**
 * 아이콘 크기별 Tailwind 클래스 맵.
 * 동적 문자열(`w-[${px}px]`) 대신 정적 클래스를 사용해 빌드 시점 purge 오류를 방지합니다.
 */
export const ICON_SIZE_CLASS: Record<'lg' | 'md' | 'sm', string> = {
  lg: 'min-w-6 w-6 h-6',
  md: 'min-w-5 w-5 h-5',
  sm: 'min-w-4 w-4 h-4',
};

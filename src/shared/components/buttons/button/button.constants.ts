import { cva } from 'class-variance-authority';

export const BASE_CLASS =
  'inline-flex items-center justify-center gap-1 [letter-spacing:-0.025em] cursor-pointer transition-colors duration-200 disabled:cursor-not-allowed';

/**
 * primary / secondary / text 세 variant 와 lg / md / sm size 를
 * compound variants 로 통합한 단일 CVA
 */
export const buttonVariants = cva(BASE_CLASS, {
  variants: {
    variant: {
      primary:
        'bg-primary-500 hover:bg-primary-500/80 active:bg-primary-700 font-bold text-white hover:shadow-md active:scale-[0.98] disabled:scale-100 disabled:bg-gray-200 disabled:text-gray-50 disabled:shadow-none',
      secondary:
        'active:bg-primary-500! border border-gray-200 bg-white font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98] active:border-0! active:text-white! active:shadow-none! disabled:scale-100 disabled:bg-white disabled:text-gray-200 disabled:shadow-none',
      text: 'group justify-start font-medium disabled:bg-transparent disabled:text-gray-300',
    },
    size: {
      lg: '',
      md: '',
      sm: '',
    },
  },
  compoundVariants: [
    /* primary */
    {
      variant: 'primary',
      size: 'lg',
      class: 'h-[54px] rounded-2xl px-10 py-[14px] text-lg',
    },
    {
      variant: 'primary',
      size: 'md',
      class: 'h-12 rounded-[14px] px-10 py-[14px] text-lg',
    },
    {
      variant: 'primary',
      size: 'sm',
      class: 'text-md h-[41px] rounded-xl px-10 py-3',
    },
    /* secondary */
    {
      variant: 'secondary',
      size: 'lg',
      class: 'h-[54px] rounded-2xl px-10 py-[14px] text-lg',
    },
    {
      variant: 'secondary',
      size: 'md',
      class: 'h-12 rounded-[14px] px-10 py-[14px] text-lg',
    },
    {
      variant: 'secondary',
      size: 'sm',
      class: 'text-md h-[34px] rounded-[12px] px-5 py-1',
    },
    /* text */
    {
      variant: 'text',
      size: 'lg',
      class: 'h-[54px] w-[115px] gap-2 rounded-2xl py-3 pr-10 pl-5 text-lg',
    },
    {
      variant: 'text',
      size: 'md',
      class: 'h-12 w-[115px] gap-2 rounded-[14px] py-[14px] pr-10 pl-5 text-lg',
    },
    {
      variant: 'text',
      size: 'sm',
      class:
        'text-md h-[41px] w-[115px] gap-[5px] rounded-[12px] py-3 pr-10 pl-5',
    },
  ],
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

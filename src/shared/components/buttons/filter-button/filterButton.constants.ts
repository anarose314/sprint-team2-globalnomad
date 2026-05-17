import { cva } from 'class-variance-authority';

/**
 * 아이콘 크기 Tailwind 클래스
 * 모바일(기본) 16px → PC/TB(md:) 24px 반응형
 */
export const FILTER_ICON_CLASS = 'block shrink-0 w-4 h-4 md:w-6 md:h-6';

/**
 * size variant 없이 반응형 단일 클래스로 처리
 * - 모바일(기본): h-[37px] gap-1 px-em text-md
 * - PC/TB(md:): h-11 gap-1.5 md:text-lg
 * - px-em: 폰트 크기에 비례한 좌우 패딩, py 불필요 (items-center 수직 정렬)
 */
export const filterButtonVariants = cva(
  'text-md px-em inline-flex h-9.25 cursor-pointer items-center justify-center gap-1 rounded-full transition-all duration-200 md:h-11 md:gap-1.5 md:text-lg',
  {
    variants: {
      state: {
        normal:
          'border border-[#D8D8D8] bg-white font-medium text-gray-950 hover:border-transparent hover:bg-[#333333] hover:font-bold hover:text-white',
        active: 'bg-[#333333] font-bold text-white',
      },
    },
    defaultVariants: {
      state: 'normal',
    },
  }
);

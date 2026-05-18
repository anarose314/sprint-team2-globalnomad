import { cva } from 'class-variance-authority';

/**
 * 아이콘 크기 Tailwind 클래스
 * 모바일(기본) 16px → PC/TB(md:) 24px 반응형
 */
export const FILTER_ICON_CLASS = 'block shrink-0 w-4 h-4 md:w-6 md:h-6';

/** globals.css의 @keyframes filter-button-press / .filter-button-press-animate 와 이름을 맞출 것 */
export const FILTER_BUTTON_PRESS_ANIMATE_CLASS = 'filter-button-press-animate';

/**
 * size variant 없이 반응형 단일 클래스로 처리
 * - 모바일(기본): h-[37px] gap-1 px-em text-md
 * - PC/TB(md:): h-11 gap-1.5 md:text-lg
 * - px-em: 폰트 크기에 비례한 좌우 패딩, py 불필요 (items-center 수직 정렬)
 */
export const filterButtonVariants = cva(
  [
    'typo-md px-em inline-flex h-9.25 cursor-pointer items-center justify-center gap-1 rounded-full',
    'border font-medium text-gray-950',
    'transition-[background-color,border-color,color] duration-200 ease-out',
    'md:typo-lg md:h-11 md:gap-1.5',
  ].join(' '),
  {
    variants: {
      state: {
        normal:
          'border-[#D8D8D8] bg-white hover:border-transparent hover:bg-[#333333] hover:text-white',
        // normal과 동일한 1px 테두리 유지(배경과 같은 색) → 선택/해제 시 가로 폭이 변하지 않음
        active: 'border-[#333333] bg-[#333333] text-white',
      },
    },
    defaultVariants: {
      state: 'normal',
    },
  }
);

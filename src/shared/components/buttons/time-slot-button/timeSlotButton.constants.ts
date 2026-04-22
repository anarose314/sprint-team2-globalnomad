import { cva } from 'class-variance-authority';

export const timeSlotVariants = cva(
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

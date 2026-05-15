import { cn } from '@/shared/utils/cn';

export const INPUT_STYLE = cn(
  'typo-lg-medium min-h-13.5 w-full rounded-2xl border border-gray-100 bg-white px-5 py-4 text-gray-950 transition-colors outline-none placeholder:text-gray-400',
  'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400',
  'focus:border-primary-500 focus:ring-primary-500 focus:ring-1'
);

export const INPUT_LABEL_STYLE = cn('typo-lg-medium mb-2 text-gray-950');

export const INPUT_ERROR_STYLE = cn(
  'border-red-500 focus:border-red-500 focus:ring-red-500'
);

export const INPUT_ERROR_MESSAGE_STYLE = cn('typo-sm-medium mt-2 text-red-500');

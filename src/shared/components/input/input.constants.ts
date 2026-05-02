import { cn } from '@/shared/utils/cn';

export const INPUT_STYLE = cn(
  'typo-lg-medium min-h-13.5 w-full rounded-2xl border bg-white px-5 py-4 text-gray-950 transition-colors outline-none placeholder:text-gray-400 focus:ring-1',
  'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400',
  'focus:border-primary-500 focus:ring-primary-500 border-gray-100'
);

export const INPUT_LABEL_STYLE = 'typo-lg-medium mb-2 text-gray-950';

export const INPUT_ERROR_STYLE =
  'border-red-500 focus:border-red-500 focus:ring-red-500';

export const INPUT_ERROR_MESSAGE_STYLE = 'typo-sm-medium mt-2 text-red-500';

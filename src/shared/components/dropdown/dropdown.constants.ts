import type { DropdownVariant } from '@/shared/components/dropdown/dropdown.types';
import { INPUT_STYLE } from '@/shared/components/input/input.constants';
import { cn } from '@/shared/utils/cn';

export const DEFAULT_OPTION_HEIGHT = 54;

export const DEFAULT_MAX_VISIBLE_OPTIONS = 5;

export const FIELD_INPUT_FOCUS_CLASS = cn(
  'border-primary-500 ring-primary-500 ring-1'
);

export const TRIGGER_VARIANT_CLASS: Record<DropdownVariant, string> = {
  field: cn(
    'h-14 w-full justify-between gap-3 rounded-2xl border-gray-300 px-5'
  ),
  fieldInput: cn(INPUT_STYLE, 'justify-between gap-3'),
  chip: cn(
    'h-10 w-22 justify-center gap-1.5 rounded-lg border-gray-100 py-2.5 pr-2.5 pl-4'
  ),
};

export const MENU_VARIANT_CLASS: Record<DropdownVariant, string> = {
  field: cn('w-full rounded-b-2xl border-t-0 border-gray-300'),
  fieldInput: cn('w-full rounded-b-2xl border-t-0', FIELD_INPUT_FOCUS_CLASS),
  chip: cn('min-w-36 rounded-lg border-gray-100'),
};

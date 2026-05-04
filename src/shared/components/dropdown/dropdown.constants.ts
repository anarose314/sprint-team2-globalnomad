import type { DropdownVariant } from '@/shared/components/dropdown/dropdown.types';

export const DEFAULT_OPTION_HEIGHT = 54;

export const DEFAULT_MAX_VISIBLE_OPTIONS = 5;

export const TRIGGER_VARIANT_CLASS: Record<DropdownVariant, string> = {
  field:
    'h-14 w-full rounded-2xl border border-gray-300 bg-white px-5 typo-lg-medium text-gray-950',
  chip: 'h-10 w-22 rounded-lg border border-gray-100 bg-white pl-4 pr-2.5 py-2.5 typo-lg-medium text-gray-950',
};

export const MENU_VARIANT_CLASS: Record<DropdownVariant, string> = {
  field: 'w-full rounded-b-2xl border border-t-0 border-gray-300',
  chip: 'min-w-36 rounded-lg border border-gray-100',
};

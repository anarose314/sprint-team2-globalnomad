'use client';

import { ReserveTimeDropdownProps } from '@/app/(main)/activity/components/reserve-time-dropdown/reserveTimeDropdown.types';
import { Dropdown } from '@/shared/components/dropdown';
import { FIELD_INPUT_ERROR_FOCUS_CLASS } from '@/shared/components/dropdown/dropdown.constants';
import { INPUT_ERROR_STYLE } from '@/shared/components/input/input.constants';
import { TIME_OPTIONS } from '@/shared/constants/time.constants';
import { cn } from '@/shared/utils/cn';

export function ReserveTimeDropdown({
  label,
  value,
  onChange,
  isError,
}: ReserveTimeDropdownProps) {
  return (
    <Dropdown
      variant="fieldInput"
      label={label}
      options={TIME_OPTIONS}
      value={value}
      placeholder="0:00"
      onChange={(value) => onChange(value)}
      triggerClassName={cn(isError && INPUT_ERROR_STYLE)}
      menuClassName={cn(isError && FIELD_INPUT_ERROR_FOCUS_CLASS)}
    />
  );
}

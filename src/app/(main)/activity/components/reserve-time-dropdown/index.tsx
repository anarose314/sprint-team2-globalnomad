'use client';

import { Dropdown } from '@/shared/components/dropdown';
import { TIME_OPTIONS } from '@/shared/constants/time.constants';

interface ReserveTimeDropdownProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
}

export function ReserveTimeDropdown({
  label,
  value,
  onChange,
}: ReserveTimeDropdownProps) {
  return (
    <Dropdown
      label={label}
      options={TIME_OPTIONS}
      value={value}
      placeholder="0:00"
      onChange={onChange}
      triggerClassName="border-gray-100"
      menuClassName="border-gray-100"
    />
  );
}

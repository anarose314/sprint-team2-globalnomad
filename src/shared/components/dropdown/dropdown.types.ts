export type DropdownVariant = 'field' | 'chip';

export interface DropdownOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  variant?: DropdownVariant;
  optionHeight?: number;
  maxVisibleOptions?: number;
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
  onChange: (value: string, option: DropdownOption) => void;
  label?: string;
}

'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { IcArrowDown } from '@/shared/assets/icons';
import {
  DEFAULT_MAX_VISIBLE_OPTIONS,
  DEFAULT_OPTION_HEIGHT,
  FIELD_INPUT_ERROR_FOCUS_CLASS,
  FIELD_INPUT_FOCUS_CLASS,
  MENU_VARIANT_CLASS,
  TRIGGER_VARIANT_CLASS,
} from '@/shared/components/dropdown/dropdown.constants';
import type {
  DropdownOption,
  DropdownProps,
} from '@/shared/components/dropdown/dropdown.types';
import {
  INPUT_ERROR_MESSAGE_STYLE,
  INPUT_ERROR_STYLE,
  INPUT_LABEL_STYLE,
} from '@/shared/components/input/input.constants';
import { cn } from '@/shared/utils/cn';

/**
 * 공통 드롭다운 컴포넌트
 *
 * - `field`: 폼 입력처럼 사용하는 기본 드롭다운입니다.
 * - `fieldInput`: Input 공통 컴포넌트와 Focus와 disabled를 공유하는 드롭다운입니다.
 * - `chip`: 가격 필터처럼 짧은 트리거 문구를 고정해서 사용하는 드롭다운입니다.
 * - 옵션 선택 시 `onChange`를 통해 선택한 값을 외부로 전달합니다.
 * - 옵션 데이터의 정렬, 필터링, API 연동은 사용하는 쪽에서 담당합니다.
 * - 옵션 목록은 기본적으로 최대 5개까지 노출되며, 초과 시 내부 스크롤됩니다.
 *
 * @example
 * <Dropdown
 *   options={categoryOptions}
 *   value={category}
 *   placeholder="카테고리"
 *   onChange={(value) => setCategory(value)}
 * />
 */
export function Dropdown({
  label,
  options,
  value,
  placeholder = '선택해주세요',
  disabled = false,
  variant = 'field',
  optionHeight = DEFAULT_OPTION_HEIGHT,
  maxVisibleOptions = DEFAULT_MAX_VISIBLE_OPTIONS,
  className,
  triggerClassName,
  menuClassName,
  errorMessage,
  onChange,
  onBlur,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasOpened = useRef(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownId = useId();
  const listboxId = `${dropdownId}-listbox`;
  const buttonId = `${dropdownId}-button`;
  const selectedOption = options.find((option) => option.value === value);
  const isDisabled = disabled || options.length === 0;
  const isFieldVariant = variant === 'field' || variant === 'fieldInput';

  // 옵션 목록은 기본 5개까지만 노출하고, 초과 시 내부 스크롤됩니다.
  const menuMaxHeight = optionHeight * maxVisibleOptions;

  const triggerLabel =
    variant === 'chip' ? placeholder : (selectedOption?.label ?? placeholder);

  const isPlaceholder = !selectedOption && isFieldVariant;

  const handleToggle = () => {
    if (isDisabled) return;

    setIsOpen((prev) => !prev);
  };

  const handleOptionClick = (option: DropdownOption) => {
    if (option.disabled) return;

    onChange(option.value, option);
    setIsOpen(false);
  };

  const handleButtonBlur = () => {
    if (isOpen) return;
    if (onBlur) onBlur();
  };

  useEffect(() => {
    if (isOpen) {
      hasOpened.current = true;
    } else if (hasOpened.current && onBlur) {
      onBlur();
    }
  }, [isOpen, onBlur]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: PointerEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handleClickOutside);

    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  return (
    <div>
      <div
        ref={dropdownRef}
        className={cn(
          'relative',
          isFieldVariant ? 'w-full' : 'inline-block',
          className
        )}
      >
        {label && (
          <label htmlFor={buttonId} className={cn(INPUT_LABEL_STYLE, 'block')}>
            {label}
          </label>
        )}
        <button
          id={buttonId}
          type="button"
          disabled={isDisabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={isOpen ? listboxId : undefined}
          className={cn(
            // 공통 필수 속성 및 비활성화 상태
            'typo-lg-medium flex cursor-pointer items-center border bg-white text-gray-950 transition-colors',
            'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400',
            // 상수 파일의 디자인 및 커스텀 클래스
            TRIGGER_VARIANT_CLASS[variant],
            triggerClassName,
            // 추가 상태
            isOpen && isFieldVariant && 'rounded-b-none',
            isOpen && variant === 'fieldInput' && FIELD_INPUT_FOCUS_CLASS,
            errorMessage && INPUT_ERROR_STYLE,
            isOpen &&
              errorMessage &&
              variant === 'fieldInput' &&
              FIELD_INPUT_ERROR_FOCUS_CLASS
          )}
          onClick={handleToggle}
          onBlur={handleButtonBlur}
        >
          <span
            className={cn(
              variant === 'chip' ? 'shrink-0 whitespace-nowrap' : 'truncate',
              isPlaceholder && 'text-gray-400'
            )}
          >
            {triggerLabel}
          </span>

          <IcArrowDown
            aria-hidden="true"
            className={cn(
              'shrink-0 transition-transform',
              variant === 'chip' ? 'size-5' : 'size-6',
              isOpen && 'rotate-180'
            )}
          />
        </button>

        {isOpen && (
          <ul
            id={listboxId}
            role="listbox"
            className={cn(
              // 공통 필수 속성 및 비활성화 상태
              'z-dropdown absolute top-full left-0 overflow-y-auto border bg-white',
              // 상수 파일의 디자인 및 커스텀 클래스
              MENU_VARIANT_CLASS[variant],
              menuClassName,
              // 추가 상태
              errorMessage &&
                variant === 'fieldInput' &&
                FIELD_INPUT_ERROR_FOCUS_CLASS
            )}
            style={{ maxHeight: menuMaxHeight }}
          >
            {options.map((option) => {
              const isSelected = option.value === value;
              const isOptionDisabled = option.disabled;

              return (
                <li key={option.value}>
                  <button
                    type="button"
                    role="option"
                    disabled={isOptionDisabled}
                    aria-selected={isSelected}
                    className={cn(
                      'typo-lg-medium flex w-full cursor-pointer items-center px-5 text-left text-gray-950 transition-colors',
                      'hover:bg-primary-100 hover:text-primary-500',
                      isSelected && 'bg-primary-100 text-primary-500',
                      isOptionDisabled &&
                        'cursor-not-allowed text-gray-400 hover:bg-white hover:text-gray-400'
                    )}
                    style={{ height: optionHeight }}
                    onClick={() => handleOptionClick(option)}
                  >
                    <span className="truncate">{option.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {errorMessage && (
        <p className={INPUT_ERROR_MESSAGE_STYLE}>{errorMessage}</p>
      )}
    </div>
  );
}

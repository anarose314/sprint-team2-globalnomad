'use client';

import { useId, useState } from 'react';
import { IcEyeOff, IcEyeOn } from '@/shared/assets/icons';
import type { InputProps } from '@/shared/components/input/input.types';
import { cn } from '@/shared/utils/cn';

/**
 * 공통 Input 컴포넌트
 *
 * - label, errorMessage, rightIcon UI를 지원한다.
 * - 기본 / focus / error 상태 스타일을 포함한다.
 * - type="password"이고 isPasswordToggle이 true일 경우 비밀번호 보기/숨김 기능을 지원한다.
 * - password toggle이 활성화된 경우 rightIcon보다 eye icon을 우선 표시한다.
 * - 유효성 검사 로직은 외부에서 처리하고, errorMessage 유무로 error UI만 표시한다.
 *
 * @example
 * <Input label="이메일" placeholder="이메일을 입력해 주세요" />
 *
 * @example
 * <Input
 *   label="비밀번호"
 *   type="password"
 *   isPasswordToggle
 *   errorMessage="비밀번호가 일치하지 않습니다."
 * />
 */
export function Input({
  label,
  errorMessage,
  rightIcon,
  isPasswordToggle = false,
  id,
  className,
  disabled,
  type = 'text',
  ref,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hasError = Boolean(errorMessage);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isPasswordType = type === 'password';
  const shouldShowPasswordToggle = isPasswordType && isPasswordToggle;
  const hasRightElement = shouldShowPasswordToggle || Boolean(rightIcon);

  const inputType =
    shouldShowPasswordToggle && isPasswordVisible ? 'text' : type;

  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <div className="flex w-full flex-col">
      {label && (
        <label htmlFor={inputId} className="typo-lg-medium mb-2 text-gray-950">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={inputType}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${inputId}-error` : undefined}
          className={cn(
            'typo-lg-medium h-13.5 w-full rounded-2xl border bg-white py-4 text-gray-950 transition-colors outline-none placeholder:text-gray-400 focus:ring-1',
            hasRightElement ? 'pr-14 pl-5' : 'px-5',
            'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400',
            hasError
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'focus:border-primary-500 focus:ring-primary-500 border-gray-100',
            className
          )}
          {...props}
        />

        {shouldShowPasswordToggle ? (
          <button
            type="button"
            onClick={handleTogglePasswordVisibility}
            disabled={disabled}
            aria-label={isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
            className="absolute top-1/2 right-5 flex -translate-y-1/2 cursor-pointer items-center justify-center text-gray-400 disabled:cursor-not-allowed"
          >
            {isPasswordVisible ? <IcEyeOn /> : <IcEyeOff />}
          </button>
        ) : rightIcon ? (
          <span className="absolute top-1/2 right-5 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </span>
        ) : null}
      </div>

      {hasError && (
        <p id={`${inputId}-error`} className="typo-sm-medium mt-2 text-red-500">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

'use client';

import { useId, useState } from 'react';
import { IcEyeOff, IcEyeOn } from '@/shared/assets/icons';
import {
  INPUT_ERROR_MESSAGE_STYLE,
  INPUT_ERROR_STYLE,
  INPUT_LABEL_STYLE,
  INPUT_STYLE,
} from '@/shared/components/input/input.constants';
import type { InputProps } from '@/shared/components/input/input.types';
import { cn } from '@/shared/utils/cn';

/**
 * 공통 Input 컴포넌트
 *
 * - label, errorMessage, rightIcon UI를 지원한다.
 * - 기본 / focus / error 상태 스타일을 포함한다.
 * - type="password"일 경우 비밀번호 보기/숨김 기능을 지원한다.
 * - password알 경우 rightIcon보다 eye icon을 우선 표시한다.
 * - 유효성 검사 로직은 외부에서 처리하고, errorMessage 유무로 error UI만 표시한다.
 *
 * @example
 * <Input label="이메일" placeholder="이메일을 입력해 주세요" />
 *
 * @example
 * <Input
 *   label="비밀번호"
 *   type="password"
 *   errorMessage="비밀번호가 일치하지 않습니다."
 * />
 */
export function Input({
  label,
  errorMessage,
  rightIcon,
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
  const shouldShowPasswordToggle = isPasswordType;
  const hasRightElement = shouldShowPasswordToggle || Boolean(rightIcon);

  const inputType =
    shouldShowPasswordToggle && isPasswordVisible ? 'text' : type;

  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <div className="flex w-full flex-col">
      {label && (
        <label htmlFor={inputId} className={INPUT_LABEL_STYLE}>
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
            INPUT_STYLE,
            hasRightElement && 'pr-14 pl-5',
            hasError && INPUT_ERROR_STYLE,
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
            aria-controls={inputId}
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
        <p id={`${inputId}-error`} className={INPUT_ERROR_MESSAGE_STYLE}>
          {errorMessage}
        </p>
      )}
    </div>
  );
}

import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { InputProps } from '@/shared/components/input/input.types';

/**
 * 공통 Input 컴포넌트
 *
 * - label, errorMessage, rightIcon UI를 지원한다.
 * - 기본 / focus / error 상태 스타일을 포함한다.
 *
 * @example
 * <Input
 *   label="이메일"
 *   placeholder="이메일을 입력해 주세요"
 * />
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
  ...props
}: InputProps) {
  const inputId = id ?? label ?? props.name;
  const hasError = Boolean(errorMessage);

  return (
    <div className="flex w-full flex-col">
      {/* label 영역 */}
      {label ? (
        <label
          htmlFor={inputId}
          className="mb-2 text-lg font-medium text-gray-950"
        >
          {label}
        </label>
      ) : null}

      {/* input + icon wrapper */}
      <div className="relative">
        <input
          id={inputId}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${inputId}-error` : undefined}
          className={twMerge(
            clsx(
              'typo-lg-medium h-13.5 w-full rounded-2xl border bg-white px-5 py-4 text-gray-950 transition-colors outline-none placeholder:text-gray-400',
              'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400',
              hasError
                ? 'border-red-500 focus:border-red-500'
                : 'focus:border-primary-500 border-gray-100'
            ),
            className
          )}
          {...props}
        />

        {/* 우측 아이콘 영역 */}
        {rightIcon ? (
          <span className="absolute top-1/2 right-5 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </span>
        ) : null}
      </div>

      {/* 에러 메시지 */}
      {hasError ? (
        <p
          id={`${inputId}-error`}
          className="mt-2 text-sm font-medium text-red-500"
        >
          {errorMessage}
        </p>
      ) : null}

      {/* TODO: password 타입일 경우 eye 아이콘 토글 기능 추가 */}
      {/* TODO: 공통 아이콘 컴포넌트 (shared/assets/icons)로 교체 */}
    </div>
  );
}

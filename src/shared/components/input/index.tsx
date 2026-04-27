import { useId } from 'react';
import type { InputProps } from '@/shared/components/input/input.types';
import { cn } from '@/shared/utils/cn';

/**
 * 공통 Input 컴포넌트
 *
 * - label, errorMessage, rightIcon UI를 지원한다.
 * - 기본 / focus / error 상태 스타일을 포함한다.
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
  ref,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hasError = Boolean(errorMessage);

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
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${inputId}-error` : undefined}
          className={cn(
            'typo-lg-medium h-13.5 w-full rounded-2xl border bg-white py-4 text-gray-950 transition-colors outline-none placeholder:text-gray-400 focus:ring-1',

            // 아이콘 유무에 따른 padding 조절
            rightIcon ? 'pr-14 pl-5' : 'px-5',
            'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400',

            // 에러 상태 스타일
            hasError
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'focus:border-primary-500 focus:ring-primary-500 border-gray-100',
            className
          )}
          {...props}
        />

        {rightIcon && (
          <span className="absolute top-1/2 right-5 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </span>
        )}
      </div>

      {hasError && (
        <p
          id={`${inputId}-error`}
          className="mt-2 text-sm font-medium text-red-500"
        >
          {errorMessage}
        </p>
      )}

      {/* TODO: password 타입일 경우 eye 아이콘 토글 기능 추가 */}
      {/* TODO: 공통 아이콘 컴포넌트(shared/assets/icons) 연결 */}
    </div>
  );
}

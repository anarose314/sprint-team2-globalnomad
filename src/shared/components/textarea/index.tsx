'use client';

import { useId } from 'react';
import {
  INPUT_ERROR_MESSAGE_STYLE,
  INPUT_ERROR_STYLE,
  INPUT_LABEL_STYLE,
  INPUT_STYLE,
} from '@/shared/components/input/input.constants';
import { TextareaProps } from '@/shared/components/textarea/textarea.types';
import { cn } from '@/shared/utils/cn';

/**
 * 공통 Textarea 컴포넌트
 *
 * @example
 * <Textarea label="설명" placeholder="내용을 입력하세요" />
 */
export function Textarea({
  label,
  errorMessage,
  id,
  className,
  rows = 6,
  ref,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hasError = Boolean(errorMessage);

  return (
    <div className="flex w-full flex-col">
      {label && (
        <label htmlFor={inputId} className={INPUT_LABEL_STYLE}>
          {label}
        </label>
      )}

      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${inputId}-error` : undefined}
        className={cn(
          INPUT_STYLE,
          hasError && INPUT_ERROR_STYLE,
          'resize-none',
          className
        )}
        {...props}
      />

      {hasError && (
        <p id={`${inputId}-error`} className={INPUT_ERROR_MESSAGE_STYLE}>
          {errorMessage}
        </p>
      )}
    </div>
  );
}

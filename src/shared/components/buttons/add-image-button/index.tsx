'use client';

import { IcPlus } from '@/shared/assets/icons';
import { cn } from '@/shared/utils/cn';

export interface AddImageButtonProps {
  errorId?: string;
  errorMessage?: string;
  className?: string;
  disabled?: boolean;
  onDisabledClick?: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

/**
 * 이미지 등록 영역에 사용하는 정사각형 버튼
 *
 * @example
 * <AddImageButton id={id} errorId={errorId} errorMessage={errorMessage} />
 */
export function AddImageButton({
  errorId,
  errorMessage,
  className,
  disabled,
  onDisabledClick,
  inputRef,
}: AddImageButtonProps) {
  return (
    <button
      type="button"
      aria-disabled={disabled}
      aria-describedby={errorMessage ? errorId : undefined}
      onClick={() => {
        if (disabled) {
          onDisabledClick?.();
        } else {
          inputRef.current?.click();
        }
      }}
      className={cn(
        'group flex flex-col items-center justify-center',
        'aspect-square w-full gap-1 md:gap-2',
        'rounded-2xl border border-gray-100 bg-white text-gray-400',
        'transition-colors duration-200',
        disabled
          ? 'cursor-not-allowed opacity-50'
          : 'cursor-pointer hover:border-gray-300 hover:text-gray-600',
        className
      )}
    >
      <span className="flex h-7.5 w-7.5 shrink-0 items-center justify-center md:h-10 md:w-10">
        <IcPlus className="h-3.75 w-3.75 md:h-5 md:w-5" />
      </span>
      <span className="typo-xs-medium md:typo-md-medium leading-4">
        이미지 등록
      </span>
    </button>
  );
}

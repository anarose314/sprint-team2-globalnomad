'use client';

import { ButtonHTMLAttributes } from 'react';
import { IcPlus } from '@/shared/assets/icons';
import { cn } from '@/shared/utils/cn';

export type AddImageButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * 이미지 등록 영역에 사용하는 정사각형 버튼
 *
 * 반응형으로만 작동: 기본 80×80 → md 이상 128×128
 *
 * @example
 * <AddImageButton onClick={openFilePicker} />
 */
export function AddImageButton({ className, ...rest }: AddImageButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'group inline-flex cursor-pointer flex-col items-center justify-center',
        'rounded-2xl border border-gray-100 bg-white',
        'transition-colors duration-200 hover:border-gray-300',
        'h-20 w-20 gap-1 md:h-32 md:w-32 md:gap-2',
        className
      )}
      {...rest}
    >
      <span className="block h-7.5 w-7.5 shrink-0 text-gray-400 transition-colors duration-200 group-hover:text-gray-600 md:h-10 md:w-10">
        <IcPlus width="100%" height="100%" style={{ display: 'block' }} />
      </span>
      <span className="md:text-md text-xs leading-4 font-medium text-gray-400 transition-colors duration-200 group-hover:text-gray-600">
        이미지 등록
      </span>
    </button>
  );
}

'use client';

import { useState } from 'react';
import { IcEyeOff, IcEyeOn } from '@/shared/assets/icons';
import { Input } from '@/shared/components/input';
import type { InputProps } from '@/shared/components/input/input.types';

/**
 * 비밀번호 입력 전용 Input 컴포넌트.
 * 공통 Input의 `rightIcon` prop에 보기/숨기기 토글 버튼을 주입한다.
 *
 * @remarks
 * 공통 Input에 비밀번호 토글이 내장되면 이 래퍼는 제거될 수 있다.
 *
 * @example
 * <PasswordInput
 *   label="비밀번호"
 *   placeholder="비밀번호를 입력해 주세요"
 *   value={password}
 *   onChange={(e) => setPassword(e.target.value)}
 * />
 */
export default function PasswordInput(
  props: Omit<InputProps, 'type' | 'rightIcon'>
) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleButton = (
    <button
      type="button"
      onClick={() => setIsVisible((prev) => !prev)}
      aria-label={isVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
      className="cursor-pointer text-gray-400"
    >
      {isVisible ? (
        <IcEyeOn className="h-5 w-5" />
      ) : (
        <IcEyeOff className="h-5 w-5" />
      )}
    </button>
  );

  return (
    <Input
      {...props}
      type={isVisible ? 'text' : 'password'}
      rightIcon={toggleButton}
    />
  );
}

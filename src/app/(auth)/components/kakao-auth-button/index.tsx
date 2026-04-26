'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { IcKakao } from '@/shared/assets/icons';

export type KakaoAuthButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** 버튼에 표시할 텍스트 (예: "카카오 로그인", "카카오 회원가입") */
  children: ReactNode;
};
/**
 * 카카오 소셜 로그인 전용 버튼.
 *
 * 공통 Button 컴포넌트는 variant가 'primary' | 'secondary'만 지원하므로,
 * 소셜 로그인 전용 디자인은 별도 컴포넌트로 분리.
 *
 * @example
 * <KakaoAuthButton onClick={handleKakaoLogin}>카카오 로그인</KakaoAuthButton>
 * <KakaoAuthButton onClick={handleKakaoSignup}>카카오 회원가입</KakaoAuthButton>
 */

export function KakaoAuthButton({ children, ...props }: KakaoAuthButtonProps) {
  return (
    <button
      type="button"
      className="typo-lg-medium flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-4 text-gray-600 transition-colors hover:bg-gray-50"
      {...props}
    >
      <IcKakao aria-hidden="true" />
      <span>{children}</span>
    </button>
  );
}

'use client';

import { ButtonHTMLAttributes } from 'react';
import { IcKakao } from '@/shared/assets/icons';

/**
 * 카카오 소셜 로그인 전용 버튼.
 *
 * @remarks
 * 공통 Button 컴포넌트는 variant가 'primary' | 'secondary'만 지원하므로,
 * 소셜 로그인 전용 디자인은 별도 컴포넌트로 분리.
 */
export default function KakaoLoginButton(
  props: ButtonHTMLAttributes<HTMLButtonElement>
) {
  return (
    <button
      type="button"
      className="typo-lg-medium flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-4 text-base text-gray-600 transition-colors hover:bg-gray-50"
      {...props}
    >
      <IcKakao />
      <span>카카오 로그인</span>
    </button>
  );
}

'use client';

import Link from 'next/link';
import { KakaoAuthButton } from '@/app/(auth)/components/kakao-auth-button';
import {
  buildKakaoAuthUrl,
  type KakaoAuthIntent,
} from '@/shared/apis/auth/kakao';

export type AuthFooterMode = 'signin' | 'signup';

export interface AuthFooterProps {
  /** 페이지 모드 — 'login'이면 회원가입 안내, 'signup'이면 로그인 안내 */
  mode: AuthFooterMode;
}

const FOOTER_TEXTS: Record<
  AuthFooterMode,
  {
    divider: string;
    kakao: string;
    linkPrefix: string;
    linkLabel: string;
    linkHref: string;
  }
> = {
  signin: {
    divider: 'SNS 계정으로 로그인하기',
    kakao: '카카오 로그인',
    linkPrefix: '회원이 아니신가요?',
    linkLabel: '회원가입하기',
    linkHref: '/signup',
  },
  signup: {
    divider: 'SNS 계정으로 회원가입하기',
    kakao: '카카오 회원가입',
    linkPrefix: '회원이신가요?',
    linkLabel: '로그인하기',
    linkHref: '/login',
  },
};

/** AuthFooter의 mode를 카카오 OAuth intent로 매핑 */
const MODE_TO_KAKAO_INTENT: Record<AuthFooterMode, KakaoAuthIntent> = {
  signin: 'signin',
  signup: 'signup',
};

/**
 * 인증 페이지(로그인/회원가입) 공용 푸터.
 *
 * SNS 구분선, 카카오 인증 버튼, 반대 페이지 이동 링크를 제공한다.
 * `mode` prop에 따라 모든 텍스트와 링크가 자동 결정된다.
 *
 * 카카오 버튼 클릭 시 인가 URL을 생성하고 카카오 인증 페이지로 리다이렉트한다.
 *
 * @example
 * <AuthFooter mode="login" />
 * <AuthFooter mode="signup" />
 */
export function AuthFooter({ mode }: AuthFooterProps) {
  const texts = FOOTER_TEXTS[mode];

  const handleKakaoClick = () => {
    const intent = MODE_TO_KAKAO_INTENT[mode];
    const authUrl = buildKakaoAuthUrl(intent);
    window.location.href = authUrl;
  };

  return (
    <>
      {/* SNS 구분선 */}
      <div className="my-8 flex w-full items-center gap-4">
        <hr className="flex-1 border-gray-100" aria-hidden="true" />
        <span className="text-sm text-gray-600">{texts.divider}</span>
        <hr className="flex-1 border-gray-100" aria-hidden="true" />
      </div>

      {/* 카카오 인증 */}
      <KakaoAuthButton onClick={handleKakaoClick}>
        {texts.kakao}
      </KakaoAuthButton>

      {/* 반대 페이지 이동 링크 */}
      <p className="mt-8 text-sm text-gray-400">
        {texts.linkPrefix}{' '}
        <Link href={texts.linkHref} className="text-gray-700 underline">
          {texts.linkLabel}
        </Link>
      </p>
    </>
  );
}

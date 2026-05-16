'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { KakaoAuthButton } from '@/app/(auth)/components/kakao-auth-button';
import {
  buildKakaoAuthUrl,
  consumeKakaoFrom,
  type KakaoAuthIntent,
  setKakaoFrom,
} from '@/shared/apis/auth/kakao';
import { useShowToast } from '@/shared/store/useToastStore';

export type AuthFooterMode = 'signin' | 'signup';

export interface AuthFooterProps {
  /** 페이지 모드 — 'signin'이면 회원가입 안내, 'signup'이면 로그인 안내 */
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

const MODE_TO_KAKAO_INTENT: Record<AuthFooterMode, KakaoAuthIntent> = {
  signin: 'signin',
  signup: 'signup',
};

/**
 * 인증 페이지(로그인/회원가입) 공용 푸터.
 *
 * @remarks
 * SNS 구분선, 카카오 인증 버튼, 반대 페이지 이동 링크를 제공한다.
 * `mode` prop에 따라 모든 텍스트와 링크가 자동 결정된다.
 *
 * 카카오 버튼 클릭 시 인가 URL을 생성하고 카카오 인증 페이지로 리다이렉트한다.
 * URL의 `from` query가 있으면 sessionStorage에 보존하여 카카오 흐름 후
 * 해당 경로로 redirect할 수 있도록 한다.
 * 반대 페이지 이동 링크(회원가입↔로그인 전환)에도 from을 전달하여
 * 인증 페이지 간 이동 시에도 목적지 정보가 유지된다.
 * 인가 URL 생성 실패(환경변수 누락, sessionStorage 접근 불가 등) 시
 * 토스트로 안내한다.
 *
 * @example
 * <AuthFooter mode="signin" />
 * <AuthFooter mode="signup" />
 */
export function AuthFooter({ mode }: AuthFooterProps) {
  const texts = FOOTER_TEXTS[mode];
  const showToast = useShowToast();
  const searchParams = useSearchParams();
  const from = searchParams.get('from');

  // 반대 페이지 이동 링크에도 from 전달 (signin ↔ signup 전환 시 목적지 보존)
  const linkHref = from
    ? `${texts.linkHref}?from=${encodeURIComponent(from)}`
    : texts.linkHref;

  const handleKakaoClick = () => {
    try {
      // URL의 from query를 sessionStorage에 보존 (카카오 흐름 후 redirect용)
      // from이 없으면 기존 값 정리 (이전 카카오 흐름의 잔여 데이터 방지)
      if (from) {
        setKakaoFrom(from);
      } else {
        consumeKakaoFrom();
      }

      const intent = MODE_TO_KAKAO_INTENT[mode];
      const authUrl = buildKakaoAuthUrl(intent);
      window.location.href = authUrl;
    } catch (error) {
      console.error('[Kakao OAuth] 인가 URL 생성 실패:', error);
      showToast({
        theme: 'error',
        message:
          '카카오 로그인 진입에 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      });
    }
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

      {/* 반대 페이지 이동 링크 — from 전달로 목적지 보존 */}
      <p className="mt-8 text-sm text-gray-400">
        {texts.linkPrefix}{' '}
        <Link href={linkHref} className="text-gray-700 underline">
          {texts.linkLabel}
        </Link>
      </p>
    </>
  );
}

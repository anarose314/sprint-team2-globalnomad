'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { KAKAO_SIGNUP_NICKNAME_PATH } from '@/shared/apis/auth/auth.constants';
import {
  consumeKakaoOAuthState,
  parseKakaoOAuthState,
  setKakaoPendingSignup,
} from '@/shared/apis/auth/kakao';
import { useShowToast } from '@/shared/store/useToastStore';

/**
 * 카카오 OAuth 콜백 페이지.
 *
 * 카카오 인가 성공 후 redirect되는 페이지. 사용자가 머무르지 않고
 * 즉시 다음 단계로 이동한다.
 *
 * 흐름:
 * 1. URL에서 code, state 추출
 * 2. sessionStorage의 state와 비교 (CSRF 검증)
 * 3. state에서 intent 추출
 *    - signup → code를 sessionStorage에 저장 + 닉네임 입력 페이지로 이동
 *    - signin → (다음 PR) 카카오 로그인 흐름
 *
 * 모든 에러는 토스트로 안내 후 로그인 페이지로 redirect한다.
 * 콜백 페이지 자체는 어떤 상태도 가지지 않는 통과 지점이다.
 */
export default function KakaoCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showToast = useShowToast();

  // React Strict Mode 등으로 useEffect가 두 번 실행되는 것을 방지.
  // sessionStorage의 state는 1회용(consume)이라 두 번째 호출은 항상 검증 실패한다.
  const hasProcessedRef = useRef(false);

  useEffect(() => {
    if (hasProcessedRef.current) return;
    hasProcessedRef.current = true;

    const redirectToLoginWithError = (message: string) => {
      showToast({ theme: 'error', message });
      router.replace('/login');
    };

    // 1. URL에서 code, state 추출
    const code = searchParams.get('code');
    const stateFromUrl = searchParams.get('state');

    if (!code || !stateFromUrl) {
      redirectToLoginWithError('잘못된 접근입니다.');
      return;
    }

    // 2. CSRF 검증 — sessionStorage의 state와 비교 후 즉시 삭제
    const stateFromStorage = consumeKakaoOAuthState();

    if (!stateFromStorage || stateFromStorage !== stateFromUrl) {
      redirectToLoginWithError('인증 요청이 만료되었거나 유효하지 않습니다.');
      return;
    }

    // 3. state에서 intent 추출
    const parsed = parseKakaoOAuthState(stateFromUrl);

    if (!parsed) {
      redirectToLoginWithError('인증 정보 형식이 올바르지 않습니다.');
      return;
    }

    // 4. intent별 분기
    if (parsed.intent === 'signin') {
      // TODO(다음 PR): 카카오 로그인 흐름 구현
      redirectToLoginWithError('카카오 로그인은 아직 지원되지 않습니다.');
      return;
    }

    // signup 흐름 — code와 redirectUri를 임시 저장 후 닉네임 입력 페이지로 이동
    const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;

    if (!redirectUri) {
      redirectToLoginWithError(
        'NEXT_PUBLIC_KAKAO_REDIRECT_URI가 설정되지 않았습니다.'
      );
      return;
    }

    setKakaoPendingSignup({ code, redirectUri });
    router.replace(KAKAO_SIGNUP_NICKNAME_PATH);
  }, [searchParams, router, showToast]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <p className="text-lg text-gray-700">카카오 로그인 처리 중...</p>
    </main>
  );
}

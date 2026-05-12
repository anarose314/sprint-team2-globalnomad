'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { KakaoCallbackPending } from '@/app/oauth/kakao/components/kakao-callback-pending';
import { useKakaoSigninMutation } from '@/app/oauth/kakao/hooks/useKakaoSigninMutation';
import { ApiError } from '@/shared/apis/apiError';
import { KAKAO_SIGNUP_NICKNAME_PATH } from '@/shared/apis/auth/auth.constants';
import {
  consumeKakaoOAuthState,
  parseKakaoOAuthState,
  setKakaoPendingSignup,
} from '@/shared/apis/auth/kakao';
import { useShowToast } from '@/shared/store/useToastStore';

/**
 * 카카오 OAuth 콜백 처리 컴포넌트.
 *
 * `useSearchParams()` 사용으로 인해 dynamic 렌더링이 필요하며,
 * 부모 페이지에서 Suspense로 감싸 빌드 시 prerender 에러를 방지한다.
 *
 * 흐름:
 * 1. URL에서 code, state 추출
 * 2. sessionStorage의 state와 비교 (CSRF 검증)
 * 3. state에서 intent 추출
 *    - signup → code를 sessionStorage에 저장 + 닉네임 입력 페이지로 이동
 *    - signin → 백엔드 로그인 API 호출
 *               - 200: 토큰 저장 + 메인으로 (mutation 훅이 처리)
 *               - 404: 미가입 사용자 → 회원가입 페이지로 안내
 *               - 그 외: 에러 토스트 + 로그인 페이지로
 *
 * 모든 에러는 토스트로 안내 후 로그인 페이지로 redirect한다.
 * sessionStorage 접근 불가 등 예외도 catch하여 사용자에게 안내한다.
 */
export function KakaoCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showToast = useShowToast();
  const { mutate: signinMutate } = useKakaoSigninMutation();

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

    /**
     * 카카오 로그인 흐름 처리.
     * 성공 시 메인으로 이동(훅의 onSuccess에서 처리), 실패 시 분기별 안내.
     */
    const handleSignin = (code: string, redirectUri: string) => {
      signinMutate(
        { token: code, redirectUri },
        {
          onError: (error) => {
            // 404: 가입되지 않은 카카오 계정 — 회원가입 페이지로 안내
            if (error instanceof ApiError && error.status === 404) {
              showToast({
                theme: 'info',
                message: '가입된 계정이 없습니다. 회원가입을 진행해 주세요.',
              });
              router.replace('/signup');
              return;
            }

            // 그 외: 일반 에러 처리
            const message =
              error instanceof Error
                ? error.message
                : '카카오 로그인에 실패했습니다.';
            showToast({ theme: 'error', message });
            router.replace('/login');
          },
        }
      );
    };

    try {
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

      // 4. redirectUri 확인 (signin/signup 모두 필요)
      const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;

      if (!redirectUri) {
        redirectToLoginWithError(
          'NEXT_PUBLIC_KAKAO_REDIRECT_URI가 설정되지 않았습니다.'
        );
        return;
      }

      // 5. intent별 분기
      if (parsed.intent === 'signin') {
        handleSignin(code, redirectUri);
        return;
      }

      // signup 흐름 — code와 redirectUri를 임시 저장 후 닉네임 입력 페이지로 이동
      setKakaoPendingSignup({ code, redirectUri });
      router.replace(KAKAO_SIGNUP_NICKNAME_PATH);
    } catch (error) {
      console.error('[Kakao OAuth Callback] 처리 중 예외 발생:', error);
      redirectToLoginWithError(
        '카카오 로그인 처리 중 문제가 발생했습니다. 다시 시도해 주세요.'
      );
    }
  }, [searchParams, router, showToast, signinMutate]);

  return <KakaoCallbackPending />;
}

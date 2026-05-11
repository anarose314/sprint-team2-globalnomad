'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { kakaoSignup } from '@/shared/apis/auth/kakao-signup';
import { useShowToast } from '@/shared/store/useToastStore';

/**
 * 카카오 간편 회원가입 mutation hook.
 *
 * BFF (`/api/auth/kakao/signup` Route Handler) 를 통해 카카오 회원가입을 진행한다.
 * Route Handler 가 백엔드 카카오 회원가입을 수행하고
 * 토큰을 httpOnly 쿠키로 자동 저장하므로,
 * 클라이언트 코드는 토큰을 직접 다루지 않는다.
 *
 * 일반 회원가입과 달리 백엔드 단일 호출로 회원가입+로그인이 완료되므로
 * 부분 실패 시나리오는 없다.
 *
 * 성공 시 토스트 안내 + 메인 페이지로 리다이렉트한다.
 * 에러 케이스별 처리는 호출부에서 mutate 의 onError 옵션으로.
 */
export const useKakaoSignupMutation = () => {
  const router = useRouter();
  const showToast = useShowToast();

  return useMutation({
    mutationFn: kakaoSignup,
    onSuccess: () => {
      showToast({
        theme: 'success',
        message: '카카오 회원가입이 완료되었습니다.',
      });
      router.replace('/');
    },
  });
};

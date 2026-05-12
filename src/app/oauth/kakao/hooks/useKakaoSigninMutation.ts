'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { kakaoSignin } from '@/shared/apis/auth/kakaoSignin';
import { useShowToast } from '@/shared/store/useToastStore';

/**
 * 카카오 간편 로그인 mutation hook.
 *
 * BFF (`/api/auth/kakao/signin` Route Handler) 를 통해 카카오 로그인을 진행한다.
 * Route Handler 가 백엔드 카카오 로그인을 수행하고
 * 토큰을 httpOnly 쿠키로 자동 저장하므로,
 * 클라이언트 코드는 토큰을 직접 다루지 않는다.
 *
 * 성공 시 토스트 안내 + 메인 페이지로 리다이렉트한다.
 *
 * 에러 케이스(404 미가입 사용자 안내 등)는 호출부에서 mutate 의 onError 옵션으로 처리.
 */
export const useKakaoSigninMutation = () => {
  const router = useRouter();
  const showToast = useShowToast();

  return useMutation({
    mutationFn: kakaoSignin,
    onSuccess: () => {
      showToast({
        theme: 'success',
        message: '카카오 로그인이 완료되었습니다.',
      });
      router.replace('/');
    },
  });
};

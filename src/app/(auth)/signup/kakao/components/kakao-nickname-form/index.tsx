'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  KakaoNicknameFormValues,
  kakaoNicknameSchema,
} from '@/app/(auth)/signup/kakao/components/kakao-nickname-form/kakao-nickname-form.schema';
import { useKakaoSignupMutation } from '@/app/(auth)/signup/kakao/hooks/useKakaoSignupMutation';
import { ApiError } from '@/shared/apis/apiError';
import {
  consumeKakaoPendingSignup,
  peekKakaoPendingSignup,
} from '@/shared/apis/auth/kakao';
import { LogoIcon, LogoVertical } from '@/shared/assets/logos';
import { Button } from '@/shared/components/buttons';
import { Input } from '@/shared/components/input';
import { useShowToast } from '@/shared/store/useToastStore';

/**
 * 카카오 회원가입 닉네임 입력 폼.
 *
 * 사용자가 닉네임을 제출하는 시점에 sessionStorage에서 카카오 인가 코드와
 * redirectUri를 꺼내(peek) 함께 백엔드로 전송한다.
 *
 * sessionStorage 데이터는 가입 성공(onSuccess) 시점에만 삭제한다.
 * 닉네임 중복 같은 검증 실패로 재시도가 발생할 수 있어, 제출마다 즉시 삭제하면
 * 첫 실패 후 재시도 시 데이터를 잃어 가입 자체가 불가능해진다.
 *
 * 잘못된 진입(sessionStorage 비어있음)은 제출 시점에 회원가입 페이지로 redirect한다.
 * 성공 처리는 useKakaoSignupMutation 의 onSuccess(메인 페이지 redirect)에서 담당하고,
 * 이 컴포넌트는 sessionStorage 정리와 폼 에러를 책임진다.
 */
export function KakaoNicknameForm() {
  const router = useRouter();
  const showToast = useShowToast();
  const { mutate, isPending } = useKakaoSignupMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<KakaoNicknameFormValues>({
    mode: 'onTouched',
    resolver: zodResolver(kakaoNicknameSchema),
    defaultValues: { nickname: '' },
  });

  const handleNicknameSubmit = (data: KakaoNicknameFormValues) => {
    // 매 제출마다 데이터 존재 확인 (삭제는 성공 시에만)
    const pending = peekKakaoPendingSignup();

    if (!pending) {
      showToast({
        theme: 'error',
        message: '잘못된 접근입니다. 다시 시도해 주세요.',
      });
      router.replace('/signup');
      return;
    }

    mutate(
      {
        token: pending.code,
        redirectUri: pending.redirectUri,
        nickname: data.nickname,
      },
      {
        onSuccess: () => {
          // 가입 성공 — sessionStorage의 임시 데이터를 비로소 삭제한다.
          // 메인 페이지 redirect는 useKakaoSignupMutation의 onSuccess에서 처리.
          consumeKakaoPendingSignup();
        },
        onError: (error) => {
          // 닉네임 중복 등 백엔드 검증 실패는 폼 필드 에러로
          // (sessionStorage 데이터는 보존 — 사용자가 다른 닉네임으로 재시도 가능)
          if (error instanceof ApiError && error.status === 409) {
            setError('nickname', { message: error.message });
            return;
          }

          // 그 외 (인가 코드 만료, 네트워크 오류 등)는 토스트로 안내 후 회원가입 페이지로
          const message =
            error instanceof Error
              ? error.message
              : '카카오 회원가입에 실패했습니다.';
          showToast({ theme: 'error', message });
          router.replace('/signup');
        },
      }
    );
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-160 flex-col items-center justify-center px-6 py-10">
      <div className="mb-10 flex flex-col items-center gap-4">
        <LogoIcon aria-hidden="true" className="w-20 md:hidden" />
        <LogoVertical aria-hidden="true" className="hidden w-63.75 md:block" />
        <h1 className="sr-only">GlobalNomad</h1>
      </div>

      <form
        onSubmit={handleSubmit(handleNicknameSubmit)}
        className="flex w-full flex-col gap-6"
        noValidate
      >
        <p className="text-center text-base text-gray-700">
          GlobalNomad에서 사용할 닉네임을 입력해 주세요.
        </p>

        <Input
          label="닉네임"
          type="text"
          placeholder="닉네임을 입력해 주세요"
          autoComplete="nickname"
          errorMessage={errors.nickname?.message}
          {...register('nickname')}
        />

        <Button type="submit" size="lg" disabled={!isValid || isPending}>
          {isPending ? '회원가입 중...' : '회원가입 완료'}
        </Button>
      </form>
    </main>
  );
}

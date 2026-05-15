'use client';

import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthFooter } from '@/app/(auth)/components/auth-footer';
import {
  SignupFormValues,
  signupSchema,
} from '@/app/(auth)/signup/components/signup-form/signup-form.schema';
import { useSignupMutation } from '@/app/(auth)/signup/hooks/useSignupMutation';
import { ApiError } from '@/shared/apis/apiError';
import type { SignupRequest } from '@/shared/apis/auth/auth.types';
import { LogoIcon, LogoVertical } from '@/shared/assets/logos';
import { Button } from '@/shared/components/buttons';
import { Input } from '@/shared/components/input';
import { useShowToast } from '@/shared/store/useToastStore';

/**
 * 회원가입 폼 컴포넌트.
 *
 * 페이지(page.tsx)는 서버 컴포넌트로 두고 metadata를 정의한 뒤,
 * 폼 상호작용 로직은 이 클라이언트 컴포넌트에서 처리한다.
 *
 * 검증 규칙은 ./signup-form.schema.ts 에 분리되어 있다.
 * API 연동은 별도 단계에서 진행한다.
 */
export function SignupForm() {
  const showToast = useShowToast();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<SignupFormValues>({
    mode: 'onTouched',
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      nickname: '',
      password: '',
      passwordConfirm: '',
    },
  });
  const { mutate, isPending } = useSignupMutation();

  const handleSignupSubmit = (data: SignupFormValues) => {
    const signupData: SignupRequest = {
      email: data.email,
      nickname: data.nickname,
      password: data.password,
    };

    mutate(signupData, {
      onError: (error) => {
        // 409 Conflict — 이메일 중복 (input 에러로 표시)
        if (error instanceof ApiError && error.status === 409) {
          setError('email', { message: error.message });
          return;
        }

        // 그 외 에러는 토스트 (fallback)
        showToast({
          theme: 'error',
          message:
            error instanceof Error ? error.message : '회원가입에 실패했습니다.',
        });
      },
    });
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-160 flex-col items-center justify-center px-6 py-10">
      {/* 로고 — 모바일은 아이콘만, 태블릿+ 는 세로형 */}
      <div className="mb-10 flex flex-col items-center gap-4">
        <Link href="/" aria-label="GlobalNomad 메인으로 이동">
          <LogoIcon aria-hidden="true" className="w-20 md:hidden" />
          <LogoVertical
            aria-hidden="true"
            className="hidden w-63.75 md:block"
          />
        </Link>
        <h1 className="sr-only">GlobalNomad</h1>
      </div>

      {/* 회원가입 폼 */}
      <form
        onSubmit={handleSubmit(handleSignupSubmit)}
        className="flex w-full flex-col gap-6"
        noValidate
      >
        <Input
          label="이메일"
          type="email"
          placeholder="이메일을 입력해 주세요"
          autoComplete="email"
          errorMessage={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="닉네임"
          type="text"
          placeholder="닉네임을 입력해 주세요"
          autoComplete="nickname"
          errorMessage={errors.nickname?.message}
          {...register('nickname')}
        />
        <Input
          label="비밀번호"
          type="password"
          placeholder="8자 이상 입력해 주세요"
          autoComplete="new-password"
          errorMessage={errors.password?.message}
          {...register('password')}
        />

        <Input
          label="비밀번호 확인"
          type="password"
          placeholder="비밀번호를 한 번 더 입력해 주세요"
          autoComplete="new-password"
          errorMessage={errors.passwordConfirm?.message}
          {...register('passwordConfirm')}
        />

        <Button type="submit" size="lg" disabled={!isValid || isPending}>
          {isPending ? '회원가입 중...' : '회원가입하기'}
        </Button>
      </form>

      <AuthFooter mode="signup" />
    </main>
  );
}

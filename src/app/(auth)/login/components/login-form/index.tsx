'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthFooter } from '@/app/(auth)/components/auth-footer';
import {
  type LoginFormValues,
  loginSchema,
} from '@/app/(auth)/login/components/login-form/login-form.schema';
import { useLoginMutation } from '@/app/(auth)/login/hooks/useLoginMutation';
import { IcEyeOff, IcEyeOn } from '@/shared/assets/icons';
import { LogoIcon, LogoVertical } from '@/shared/assets/logos';
import { Button } from '@/shared/components/buttons';
import { Input } from '@/shared/components/input';

/**
 * 로그인 폼 컴포넌트.
 *
 * 페이지(page.tsx)는 서버 컴포넌트로 두고 metadata를 정의한 뒤,
 * 폼 상호작용 로직은 이 클라이언트 컴포넌트에서 처리한다.
 *
 * 검증 규칙은 ./login-form.schema.ts 에 분리되어 있다.
 * API 연동, 토큰 저장, 리다이렉트는 별도 이슈에서 진행한다.
 */
export function LoginForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { mutate, isPending } = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    mode: 'onTouched',
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    mutate(data, {
      onError: (error) => {
        // TODO: 임시 — 다음 PR 에서 토스트로 교체
        console.error('로그인 실패:', error);
        alert(
          error instanceof Error ? error.message : '로그인에 실패했습니다.'
        );
      },
    });
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-160 flex-col items-center justify-center px-6 py-10">
      {/* 로고 — 모바일은 아이콘만, 태블릿+ 는 세로형 */}
      <div className="mb-10 flex flex-col items-center gap-4">
        <LogoIcon aria-hidden="true" className="w-20 md:hidden" />
        <LogoVertical aria-hidden="true" className="hidden w-63.75 md:block" />
        <h1 className="sr-only">GlobalNomad</h1>
      </div>

      {/* 로그인 폼 */}
      <form
        onSubmit={handleSubmit(onSubmit)}
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

        {/*
         * TODO: 공통 Input(shared/components/input)에 비밀번호 토글 기능이 추가되면
         *       아래 rightIcon 인라인 토글을 제거하고 <Input type="password" /> 한 줄로 단순화.
         *       관련: shared/components/input/index.tsx 내부 TODO 주석 참고.
         */}
        <Input
          label="비밀번호"
          type={isPasswordVisible ? 'text' : 'password'}
          placeholder="비밀번호를 입력해 주세요"
          autoComplete="current-password"
          errorMessage={errors.password?.message}
          {...register('password')}
          rightIcon={
            <button
              type="button"
              onClick={() => setIsPasswordVisible((prev) => !prev)}
              aria-label={
                isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 보기'
              }
              className="text-gray-400 transition-colors hover:text-gray-600"
            >
              {isPasswordVisible ? (
                <IcEyeOn className="h-5 w-5" />
              ) : (
                <IcEyeOff className="h-5 w-5" />
              )}
            </button>
          }
        />

        <Button type="submit" size="lg" disabled={!isValid || isPending}>
          {isPending ? '로그인 중...' : '로그인하기'}
        </Button>
      </form>

      <AuthFooter mode="login" />
    </main>
  );
}

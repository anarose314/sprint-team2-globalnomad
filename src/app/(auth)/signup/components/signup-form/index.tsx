'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthFooter } from '@/app/(auth)/components/auth-footer';
import {
  SignupFormValues,
  signupSchema,
} from '@/app/(auth)/signup/components/signup-form/signup-form.schema';
import { IcEyeOff, IcEyeOn } from '@/shared/assets/icons';
import { LogoIcon, LogoVertical } from '@/shared/assets/logos';
import { Button } from '@/shared/components/buttons';
import { Input } from '@/shared/components/input';

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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordConfirmVisible, setIsPasswordConfirmVisible] =
    useState(false);

  const {
    register,
    handleSubmit,
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

  const onSubmit = (data: SignupFormValues) => {
    // TODO: 회원가입 API 연동 (이번 PR 다음 단계)
    console.log(data);
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-160 flex-col items-center justify-center px-6 py-10">
      {/* 로고 — 모바일은 아이콘만, 태블릿+ 는 세로형 */}
      <div className="mb-10 flex flex-col items-center gap-4">
        <LogoIcon aria-hidden="true" className="w-20 md:hidden" />
        <LogoVertical aria-hidden="true" className="hidden w-63.75 md:block" />
        <h1 className="sr-only">GlobalNomad</h1>
      </div>

      {/* 회원가입 폼 */}
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

        <Input
          label="닉네임"
          type="text"
          placeholder="닉네임을 입력해 주세요"
          autoComplete="nickname"
          errorMessage={errors.nickname?.message}
          {...register('nickname')}
        />
        {/*
         * TODO: 공통 Input(shared/components/input)에 비밀번호 토글 기능이 추가되면
         *       아래 rightIcon 인라인 토글을 제거하고 <Input type="password" /> 한 줄로 단순화.
         */}
        <Input
          label="비밀번호"
          type={isPasswordVisible ? 'text' : 'password'}
          placeholder="8자 이상 입력해 주세요"
          autoComplete="new-password"
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

        <Input
          label="비밀번호 확인"
          type={isPasswordConfirmVisible ? 'text' : 'password'}
          placeholder="비밀번호를 한 번 더 입력해 주세요"
          autoComplete="new-password"
          errorMessage={errors.passwordConfirm?.message}
          {...register('passwordConfirm')}
          rightIcon={
            <button
              type="button"
              onClick={() => setIsPasswordConfirmVisible((prev) => !prev)}
              aria-label={
                isPasswordConfirmVisible ? '비밀번호 숨기기' : '비밀번호 보기'
              }
              className="text-gray-400 transition-colors hover:text-gray-600"
            >
              {isPasswordConfirmVisible ? (
                <IcEyeOn className="h-5 w-5" />
              ) : (
                <IcEyeOff className="h-5 w-5" />
              )}
            </button>
          }
        />

        <Button type="submit" size="lg" disabled={!isValid}>
          회원가입하기
        </Button>
      </form>

      <AuthFooter mode="signup" />
    </main>
  );
}

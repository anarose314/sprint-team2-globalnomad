'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { KakaoAuthButton } from '@/app/(auth)/components/kakao-auth-button';
import { IcEyeOff, IcEyeOn } from '@/shared/assets/icons';
import { LogoIcon, LogoVertical } from '@/shared/assets/logos';
import { Button } from '@/shared/components/buttons';
import { Input } from '@/shared/components/input';

/**
 * 회원가입 페이지.
 *
 * 현재는 퍼블리싱과 입력값 상태 관리까지만 구현한다.
 * 실제 회원가입 API 연동, 폼 검증(이메일 형식, 비밀번호 8자 이상,
 * 비밀번호 확인 일치) 등은 별도 이슈에서 진행한다.
 */
export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isPasswordConfirmVisible, setIsPasswordConfirmVisible] =
    useState(false);

  const isSubmitDisabled = !email || !nickname || !password || !passwordConfirm;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: 회원가입 API 연동 (별도 이슈)
    // TODO: 폼 검증 — 이메일 형식, 비밀번호 8자 이상, 비밀번호 일치 (별도 이슈)
    console.log({ email, nickname, password, passwordConfirm });
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-160 flex-col items-center justify-center px-6 py-10">
      {/* 로고 — 모바일은 아이콘만, 태블릿 이상은 세로형 */}
      <div className="mb-10 flex flex-col items-center gap-4">
        <LogoIcon aria-hidden="true" className="md:hidden" />
        <LogoVertical aria-hidden="true" className="hidden md:block" />
        <h1 className="sr-only">GlobalNomad</h1>
      </div>

      {/* 회원가입 폼 */}
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-6"
        noValidate
      >
        <Input
          label="이메일"
          type="email"
          placeholder="이메일을 입력해 주세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <Input
          label="닉네임"
          type="text"
          placeholder="닉네임을 입력해 주세요"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          autoComplete="nickname"
        />

        <Input
          label="비밀번호"
          type="password"
          placeholder="8자 이상 입력해 주세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />

        {/*
         * TODO: 공통 Input(shared/components/input)에 비밀번호 토글 기능이 추가되면
         *       아래 rightIcon 인라인 토글을 제거하고 <Input type="password" /> 한 줄로 단순화.
         *       관련: shared/components/input/index.tsx 내부 TODO 주석 참고.
         */}
        <Input
          label="비밀번호 확인"
          type={isPasswordConfirmVisible ? 'text' : 'password'}
          placeholder="비밀번호를 한 번 더 입력해 주세요"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          autoComplete="new-password"
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

        <Button type="submit" size="lg" disabled={isSubmitDisabled}>
          회원가입하기
        </Button>
      </form>

      {/* SNS 구분선 */}
      <div className="my-8 flex w-full items-center gap-4">
        <hr className="flex-1 border-gray-100" />
        <span className="text-sm text-gray-600">SNS 계정으로 회원가입하기</span>
        <hr className="flex-1 border-gray-100" />
      </div>

      {/* 카카오 회원가입 */}
      <KakaoAuthButton>카카오 회원가입</KakaoAuthButton>

      {/* 로그인 링크 */}
      <p className="mt-8 text-sm text-gray-400">
        회원이신가요?{' '}
        <Link href="/login" className="text-gray-400 underline">
          로그인하기
        </Link>
      </p>
    </main>
  );
}

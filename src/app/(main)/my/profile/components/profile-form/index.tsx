'use client';

import { useState } from 'react';
import { IcEyeOff, IcEyeOn } from '@/shared/assets/icons';
import { Button } from '@/shared/components/buttons';
import { Input } from '@/shared/components/input';

/**
 * 마이페이지 - 내 정보 수정 폼.
 *
 * - 닉네임은 수정 가능, 이메일은 readOnly
 * - 비밀번호와 비밀번호 확인 입력 필드 제공
 *
 * TODO: 폼 상태 관리 및 유효성 검사 추가
 * TODO: 내 정보 조회/수정 API 연동
 */
export function ProfileForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const toggleShowPasswordConfirm = () =>
    setShowPasswordConfirm((prev) => !prev);

  return (
    <form className="flex flex-col gap-6">
      <Input label="닉네임" placeholder="홍길동" />

      <Input
        label="이메일"
        type="email"
        placeholder="codeit@codeit.com"
        readOnly
        disabled
      />

      <Input
        label="비밀번호"
        type={showPassword ? 'text' : 'password'}
        placeholder="8자 이상 입력해 주세요"
        rightIcon={
          <button
            type="button"
            onClick={toggleShowPassword}
            aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
            className="cursor-pointer"
          >
            {showPassword ? <IcEyeOn /> : <IcEyeOff />}
          </button>
        }
      />

      <Input
        label="비밀번호 확인"
        type={showPasswordConfirm ? 'text' : 'password'}
        placeholder="비밀번호를 한 번 더 입력해 주세요"
        rightIcon={
          <button
            type="button"
            onClick={toggleShowPasswordConfirm}
            aria-label={
              showPasswordConfirm ? '비밀번호 숨기기' : '비밀번호 표시'
            }
            className="cursor-pointer"
          >
            {showPasswordConfirm ? <IcEyeOn /> : <IcEyeOff />}
          </button>
        }
      />

      <Button type="submit" size="md" className="mx-auto w-30">
        저장하기
      </Button>
    </form>
  );
}

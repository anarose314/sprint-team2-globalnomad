'use client';

import { useState } from 'react';
import { IcEyeOff, IcEyeOn } from '@/shared/assets/icons';
import { Button } from '@/shared/components/buttons';
import { Input } from '@/shared/components/input';

/**
 * 마이페이지 - 내 정보 수정 폼.
 *
 * - 닉네임은 수정 가능, 이메일은 disabled
 * - 비밀번호와 비밀번호 확인 입력 필드 제공
 *
 * TODO: 폼 상태 관리 및 유효성 검사 추가
 * TODO: 내 정보 조회/수정 API 연동
 */
export function ProfileForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordConfirmVisible, setIsPasswordConfirmVisible] =
    useState(false);

  const handlePasswordToggle = () => setIsPasswordVisible((prev) => !prev);
  const handlePasswordConfirmToggle = () =>
    setIsPasswordConfirmVisible((prev) => !prev);

  return (
    <form className="flex flex-col gap-6">
      <Input label="닉네임" placeholder="홍길동" />

      <Input
        label="이메일"
        type="email"
        placeholder="codeit@codeit.com"
        disabled
      />

      {/* TODO: 추후 공통 컴포넌트로 변경 */}
      <Input
        label="비밀번호"
        type={isPasswordVisible ? 'text' : 'password'}
        placeholder="8자 이상 입력해 주세요"
        rightIcon={
          <button
            type="button"
            onClick={handlePasswordToggle}
            aria-label={isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 표시'}
            className="cursor-pointer"
          >
            {isPasswordVisible ? <IcEyeOn /> : <IcEyeOff />}
          </button>
        }
      />

      <Input
        label="비밀번호 확인"
        type={isPasswordConfirmVisible ? 'text' : 'password'}
        placeholder="비밀번호를 한 번 더 입력해 주세요"
        rightIcon={
          <button
            type="button"
            onClick={handlePasswordConfirmToggle}
            aria-label={
              isPasswordConfirmVisible ? '비밀번호 숨기기' : '비밀번호 표시'
            }
            className="cursor-pointer"
          >
            {isPasswordConfirmVisible ? <IcEyeOn /> : <IcEyeOff />}
          </button>
        }
      />

      <Button type="submit" size="md" className="mx-auto w-30">
        저장하기
      </Button>
    </form>
  );
}

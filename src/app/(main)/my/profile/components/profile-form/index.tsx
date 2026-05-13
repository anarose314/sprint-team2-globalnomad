'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { UpdateMyInfoBody } from '@/app/(main)/my/profile/apis/myInfo';
import {
  type ProfileFormValues,
  profileSchema,
} from '@/app/(main)/my/profile/components/profile-form/profile-form.schema';
import { useMyInfo } from '@/app/(main)/my/profile/hooks/useMyInfo';
import { useUpdateMyInfoMutation } from '@/app/(main)/my/profile/hooks/useUpdateMyInfoMutation';
import { IcEyeOff, IcEyeOn } from '@/shared/assets/icons';
import { Button } from '@/shared/components/buttons';
import { Input } from '@/shared/components/input';

/**
 * 마이페이지 - 내 정보 수정 폼.
 *
 * - 서버 prefetch로 user 데이터가 hydration 캐시에 들어와 있음을 전제
 * - 닉네임은 수정 가능, 이메일은 읽기 전용
 * - 비밀번호는 변경 시에만 입력 (빈 문자열 허용)
 * - dirtyFields 기준으로 변경된 필드만 PATCH 페이로드에 포함
 *
 * TODO: 프로필 이미지 업로드 UI 추가 (별도 단계)
 * TODO: 공통 Input에 비밀번호 토글 기능 통합되면 인라인 토글 제거
 */
export function ProfileForm() {
  const { data: user } = useMyInfo();
  const { mutate, isPending } = useUpdateMyInfoMutation();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordConfirmVisible, setIsPasswordConfirmVisible] =
    useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty, dirtyFields },
  } = useForm<ProfileFormValues>({
    mode: 'onTouched',
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nickname: '',
      newPassword: '',
      newPasswordConfirm: '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        nickname: user.nickname,
        newPassword: '',
        newPasswordConfirm: '',
      });
    }
  }, [user, reset]);

  if (!user) {
    return null;
  }

  const onSubmit = (data: ProfileFormValues) => {
    const payload: UpdateMyInfoBody = {};
    if (dirtyFields.nickname) payload.nickname = data.nickname;
    if (dirtyFields.newPassword && data.newPassword !== '') {
      payload.newPassword = data.newPassword;
    }

    // 보낼 게 없으면 호출 자체 생략 (이론상 isDirty 가드로 못 옴, 안전장치)
    if (Object.keys(payload).length === 0) return;

    mutate(payload, {
      onSuccess: (updatedUser) => {
        // 폼 상태를 새 값으로 리셋 → isDirty 다시 false → 저장 버튼 비활성화
        reset({
          nickname: updatedUser.nickname,
          newPassword: '',
          newPasswordConfirm: '',
        });
      },
    });
  };

  const handlePasswordToggle = () => setIsPasswordVisible((prev) => !prev);
  const handlePasswordConfirmToggle = () =>
    setIsPasswordConfirmVisible((prev) => !prev);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
      noValidate
    >
      <Input
        label="닉네임"
        placeholder="홍길동"
        errorMessage={errors.nickname?.message}
        {...register('nickname')}
      />

      <Input label="이메일" type="email" value={user.email} disabled />

      {/* TODO: 추후 공통 컴포넌트로 변경 */}
      <Input
        label="비밀번호"
        type={isPasswordVisible ? 'text' : 'password'}
        placeholder="8자 이상 입력해 주세요"
        errorMessage={errors.newPassword?.message}
        {...register('newPassword')}
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
        errorMessage={errors.newPasswordConfirm?.message}
        {...register('newPasswordConfirm')}
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

      <Button
        type="submit"
        size="md"
        className="mx-auto w-30"
        disabled={!isDirty || !isValid || isPending}
      >
        {isPending ? '저장 중...' : '저장하기'}
      </Button>
    </form>
  );
}

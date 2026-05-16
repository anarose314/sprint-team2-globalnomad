import Image from 'next/image';
import { IcProfile } from '@/shared/assets/icons';
import type { HeaderProfileAvatarProps } from '@/shared/components/header/header.types';

/**
 * Header에서 사용하는 프로필 아바타 컴포넌트
 *
 * - profileImageUrl이 있으면 프로필 이미지를 표시한다.
 * - profileImageUrl이 없으면 기본 프로필 아이콘을 표시한다.
 *
 * @example
 * <HeaderProfileAvatar user={user} />
 */
export function HeaderProfileAvatar({ user }: HeaderProfileAvatarProps) {
  if (user.profileImageUrl) {
    return (
      <Image
        src={user.profileImageUrl}
        alt=""
        width={32}
        height={32}
        className="h-8 w-8 rounded-full object-cover"
      />
    );
  }

  return <IcProfile className="h-8 w-8" aria-hidden="true" />;
}

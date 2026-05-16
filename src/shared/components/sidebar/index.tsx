'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMyInfo } from '@/app/(main)/my/profile/hooks/useMyInfo';
import { IcClose, IcEdit, IcProfile } from '@/shared/assets/icons';
import { Button } from '@/shared/components/buttons';
import { MENU_ITEMS } from '@/shared/components/sidebar/sidebar.constants';
import type { SidebarProps } from '@/shared/components/sidebar/sidebar.types';
import { IMAGE_INPUT_ACCEPT } from '@/shared/constants/image.constants';
import { useLogoutMutation } from '@/shared/hooks/useLogoutMutation';
import { useRemoveProfileImageMutation } from '@/shared/hooks/useRemoveProfileImageMutation';
import { useUpdateProfileImageMutation } from '@/shared/hooks/useUpdateProfileImageMutation';
import { useShowToast } from '@/shared/store/useToastStore';
import { cn } from '@/shared/utils/cn';
import { validateImageFile } from '@/shared/utils/validateImageFile';

/**
 * 마이페이지에서 공용으로 사용하는 사이드바 컴포넌트.
 *
 * - 현재 경로에 해당하는 메뉴를 자동으로 활성화한다.
 * - 프로필 이미지 영역에 마우스 호버 또는 키보드 포커스 시 오버레이로 수정 아이콘이 표시된다.
 * - 사용자가 업로드한 이미지가 있을 때만 우상단에 삭제 버튼이 노출되며, 호버 시 시각 정리를 위해 숨겨진다.
 * - 로그아웃 시 인증 쿠키 삭제, 캐시 클리어, 메인 페이지 이동을 모두 처리한다.
 * - variant에 따라 데스크탑 사이드바와 모바일 드로어 내부 메뉴로 재사용한다.
 */
export function Sidebar({
  variant = 'desktop',
  onNavigate,
  onLogout,
}: SidebarProps) {
  const pathname = usePathname();
  const { data: user } = useMyInfo();
  const showToast = useShowToast();
  const { mutate: updateProfileImage, isPending: isUploading } =
    useUpdateProfileImageMutation();
  const { mutate: removeProfileImage, isPending: isRemoving } =
    useRemoveProfileImageMutation();
  const { mutate: logout, isPending: isLoggingOut } = useLogoutMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profileImageUrl = user?.profileImageUrl ?? '';
  const hasProfileImage = Boolean(profileImageUrl);
  const isProfileImageMutating = isUploading || isRemoving;
  const isDrawer = variant === 'drawer';

  const handleProfileEdit = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.isValid) {
      showToast({ theme: 'error', message: validation.message });
      return;
    }

    updateProfileImage(file);
  };

  const handleProfileImageRemove = () => {
    removeProfileImage();
  };

  const handleLogout = () => {
    onNavigate?.();
    logout();
    onLogout?.();
  };

  return (
    <aside
      className={cn(
        'bg-white',
        isDrawer
          ? 'flex h-full w-full flex-col px-5 pt-14 pb-5'
          : 'shadow-card hidden w-44.5 rounded-xl border border-gray-50 px-3.5 pt-4 pb-5 md:block 2xl:w-72.5 2xl:pt-6 2xl:pb-7'
      )}
    >
      {/* 프로필 영역 */}
      <div
        className={cn(
          'relative mx-auto w-fit',
          isDrawer ? 'mb-6' : 'mb-3 2xl:mb-6'
        )}
      >
        {/* 이미지 원 = 버튼 (peer 추가) */}
        <button
          type="button"
          onClick={handleProfileEdit}
          disabled={isProfileImageMutating}
          aria-label="프로필 이미지 수정"
          className={cn(
            'group peer relative block aspect-square cursor-pointer overflow-hidden rounded-full bg-blue-50 disabled:cursor-not-allowed',
            isDrawer ? 'w-24' : 'w-17.5 2xl:w-28'
          )}
        >
          {hasProfileImage ? (
            <Image
              src={profileImageUrl}
              alt="프로필 이미지"
              fill
              className="object-cover"
              sizes="(min-width: 1536px) 112px, 70px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-blue-200">
              <IcProfile className="h-full w-full" aria-hidden="true" />
            </div>
          )}

          {/* 호버/포커스 시 나타나는 오버레이 + 수정 아이콘 */}
          <div
            className={cn(
              'absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200',
              'group-hover:opacity-100 group-focus-visible:opacity-100',
              'group-disabled:opacity-0'
            )}
            aria-hidden="true"
          >
            <IcEdit
              className={cn(
                'text-white',
                isDrawer ? 'h-8 w-8' : 'h-6 w-6 2xl:h-8 2xl:w-8'
              )}
            />
          </div>
        </button>

        {/* 이미지 삭제 버튼 (사용자 업로드 이미지가 있을 때만, 호버/포커스 시 숨김) */}
        {hasProfileImage && (
          <button
            type="button"
            onClick={handleProfileImageRemove}
            disabled={isProfileImageMutating}
            aria-label="프로필 이미지 삭제"
            className={cn(
              'absolute -top-1 -right-1 flex cursor-pointer items-center justify-center rounded-full bg-gray-400 p-1 text-white transition-opacity duration-200 hover:bg-gray-500 disabled:cursor-not-allowed disabled:opacity-60',
              'peer-hover:pointer-events-none peer-hover:opacity-0',
              'peer-focus-visible:pointer-events-none peer-focus-visible:opacity-0',
              isDrawer ? 'h-6 w-6' : 'h-5 w-5 2xl:h-6 2xl:w-6'
            )}
          >
            <IcClose className="h-full w-full" aria-hidden="true" />
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={IMAGE_INPUT_ACCEPT}
          onChange={handleFileChange}
          className="hidden"
          aria-hidden="true"
        />
      </div>

      {/* 메뉴 영역 */}
      <nav className="flex flex-col gap-3.5" aria-label="마이페이지 메뉴">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'typo-lg-medium px-em flex h-12 items-center gap-2 rounded-2xl transition-colors 2xl:h-13.5 2xl:rounded-2xl',
                isActive
                  ? 'bg-primary-100 [&_svg]:text-primary-500 text-gray-950'
                  : 'hover:bg-primary-100 text-gray-600 [&_svg]:text-gray-600'
              )}
            >
              <item.Icon className="h-6 w-6" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* 로그아웃 버튼 */}
      <Button
        type="button"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className={cn('mt-3.5 h-12 w-full 2xl:h-13.5', isDrawer && 'mt-auto')}
        size="lg"
        variant="secondary"
      >
        {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
      </Button>
    </aside>
  );
}

'use client';

import { KebabDropdown } from '@/app/(main)/activity/[id]/components/activity-info-header/kebab-dropdown';
import { IcMap, IcShare, IcStar } from '@/shared/assets/icons';
import { Heading } from '@/shared/components/heading';
import { useShowToast } from '@/shared/store/useToastStore';
import { cn } from '@/shared/utils/cn';

export interface ActivityInfoHeaderProps {
  category: string;
  title: string;
  rating: number;
  reviewCount: number;
  address: string;
  activityId: number;
  /** 내가 만든 체험이면 true → 케밥 메뉴 노출 */
  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

/**
 * 체험 상세 페이지 상단 타이틀 영역
 *
 * 반응형 타이포그래피
 * - 카테고리 : 모바일 pretendard-13m gray-700 / PC·TB pretendard-14m gray-700
 * - 제목     : 모바일 pretendard-18B gray-950  / PC·TB pretendard-24B gray-950
 * - 별점     : IcStar 16×16 yellow-500, 텍스트 pretendard-14m gray-700
 * - 위치     : IcMap  16×16 black,      텍스트 pretendard-14m gray-700
 *
 * `isOwner=true`이면 우측에 케밥 메뉴(수정 / 삭제) 표시
 */
export function ActivityInfoHeader({
  category,
  title,
  rating,
  reviewCount,
  address,
  activityId,
  isOwner = false,
  onEdit,
  onDelete,
  className,
}: ActivityInfoHeaderProps) {
  const formattedRating = Number.isFinite(rating) ? rating.toFixed(1) : '-';
  const showToast = useShowToast();

  const handleShare = async () => {
    const configuredBaseUrl = (process.env.NEXT_PUBLIC_APP_URL ?? '').trim();
    const isLocalhost = window.location.hostname === 'localhost';
    const baseUrl =
      isLocalhost && configuredBaseUrl
        ? configuredBaseUrl
        : window.location.origin;
    const shareUrl = `${baseUrl.replace(/\/+$/, '')}/activity/${activityId}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `${title} 체험을 확인해보세요.`,
          url: shareUrl,
        });
        return;
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        showToast({
          theme: 'error',
          message: '공유에 실패했어요. 잠시 후 다시 시도해 주세요.',
        });
        return;
      }
    }

    if (!navigator.clipboard) {
      showToast({
        theme: 'error',
        message: '클립보드 복사를 지원하지 않는 브라우저입니다.',
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast({
        theme: 'success',
        message: '체험 링크를 복사했어요.',
      });
    } catch {
      showToast({
        theme: 'error',
        message: '체험 링크 복사에 실패했어요. 잠시 후 다시 시도해 주세요.',
      });
    }
  };

  return (
    <div className={cn('flex min-w-0 flex-col', className)}>
      {/* 카테고리 + 케밥 */}
      <div className="flex items-center justify-between">
        <span className="typo-sm-medium md:typo-md-medium tracking-tight text-gray-700">
          {category}
        </span>
        {isOwner && <KebabDropdown onEdit={onEdit} onDelete={onDelete} />}
      </div>

      {/* 제목 */}
      <div className="mt-1 flex items-center gap-1">
        <Heading
          as="h2"
          className="typo-2lg-bold md:typo-2xl-bold min-w-0 tracking-tight wrap-anywhere text-gray-950"
        >
          {title}
        </Heading>
        <button
          type="button"
          aria-label="체험 링크 공유"
          onClick={handleShare}
          className="text-gray-850 inline-flex shrink-0 cursor-pointer items-center justify-center rounded p-1 transition-colors hover:bg-gray-100"
        >
          <IcShare
            aria-hidden="true"
            className="text-gray-850 block size-4 shrink-0 md:size-5 2xl:size-6"
          />
        </button>
      </div>

      {/* 별점 */}
      <div className="mt-1 flex items-center gap-1">
        <IcStar
          aria-hidden="true"
          className="size-4 shrink-0 text-yellow-500"
        />
        <span className="typo-md-medium tracking-tight text-gray-700">
          {formattedRating}
        </span>
        <span className="typo-md-medium tracking-tight text-gray-700">
          ({reviewCount})
        </span>
      </div>

      {/* 위치 */}
      <div className="mt-0.5 flex items-center gap-1">
        <IcMap aria-hidden="true" className="size-4 shrink-0 text-black" />
        <span className="typo-md-medium tracking-tight text-gray-700">
          {address}
        </span>
      </div>
    </div>
  );
}

'use client';

import { ActivityDetailContent } from '@/app/(main)/activity/[id]/components/activity-detail-content';
import { ActivityImageGallery } from '@/app/(main)/activity/[id]/components/activity-image-gallery';
import { ActivityInfoHeader } from '@/app/(main)/activity/[id]/components/activity-info-header';
import { ActivityReservationCard } from '@/app/(main)/activity/[id]/components/activity-reservation-card';
import { ActivityReviewsSection } from '@/app/(main)/activity/[id]/components/activity-reviews/activityReviewsSection';
import { useActivityActions } from '@/app/(main)/activity/hooks/useActivityActions';
import { TwoButtonModal } from '@/shared/components/modal';
import { ModalOverlay } from '@/shared/components/modal/modal-overlay';
import { ActivityDetailResponse } from '@/shared/types/activityDetail.types';

interface ActivityDetailPageClientProps {
  activity: ActivityDetailResponse;
  isOwner: boolean;
  /** 로그인한 사용자만 내 예약 조회 API를 호출한다(비로그인 시 401 → 로그인 리다이렉트 방지). */
  isAuthenticated: boolean;
}

/**
 * 체험 상세 페이지의 클라이언트 상호작용 영역 렌더링
 *
 * - 소유자 여부에 따라 케밥 메뉴와 예약 카드 노출 제어
 * - 수정/삭제 액션과 삭제 성공 후 라우팅 처리
 */
export function ActivityDetailPageClient({
  activity,
  isOwner,
  isAuthenticated,
}: ActivityDetailPageClientProps) {
  const subImageUrls = Array.isArray(activity.subImages)
    ? activity.subImages.map((image) => image.imageUrl)
    : [];

  const {
    isOpen,
    isDeleting,
    handleEdit,
    handleDeleteRequest,
    handleDeleteCancel,
    handleDeleteConfirm,
  } = useActivityActions({
    initialActivityId: activity.id,
    onSuccessRedirect: '/my/activities',
  });

  return (
    <div className="py-6 pb-40 md:py-8 md:pb-40 2xl:py-10 2xl:pb-10">
      {/* 피그마 레이아웃 폭 기준: 모바일 327 / 태블릿 684 / PC 1200 (+좌우 40px) */}
      <div className="mx-auto w-full">
        <div className="flex flex-col gap-4 2xl:grid 2xl:grid-cols-5 2xl:items-start 2xl:gap-10">
          <div className="min-w-0 2xl:col-span-3">
            <ActivityImageGallery
              bannerImageUrl={activity.bannerImageUrl}
              subImageUrls={subImageUrls}
              title={activity.title}
              className="mb-5 md:mb-6 2xl:mb-10"
            />

            <div className="mb-5 border-b border-gray-100 pb-5 md:mb-8 md:pb-8 2xl:hidden">
              <ActivityInfoHeader
                activityId={activity.id}
                category={activity.category}
                title={activity.title}
                rating={activity.rating}
                reviewCount={activity.reviewCount}
                address={activity.address}
                isOwner={isOwner}
                onEdit={handleEdit}
                onDelete={handleDeleteRequest}
              />
            </div>

            <ActivityDetailContent
              description={activity.description}
              address={activity.address}
            />
            <ActivityReviewsSection activityId={activity.id} />
          </div>

          <div className="min-w-0 2xl:col-span-2 2xl:self-stretch">
            <div className="mb-8 hidden w-full max-w-103 2xl:block">
              <ActivityInfoHeader
                activityId={activity.id}
                category={activity.category}
                title={activity.title}
                rating={activity.rating}
                reviewCount={activity.reviewCount}
                address={activity.address}
                isOwner={isOwner}
                onEdit={handleEdit}
                onDelete={handleDeleteRequest}
              />
            </div>
            {!isOwner && (
              <div className="2xl:sticky 2xl:top-24">
                <ActivityReservationCard
                  activityId={activity.id}
                  pricePerPerson={activity.price}
                  schedules={activity.schedules}
                  isAuthenticated={isAuthenticated}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {isOpen ? (
        <ModalOverlay onClose={handleDeleteCancel}>
          <TwoButtonModal
            message="정말 이 체험을 삭제하시겠습니까?"
            cancelText="취소"
            confirmText="삭제"
            onCancel={handleDeleteCancel}
            onConfirm={handleDeleteConfirm}
            isPending={isDeleting}
          />
        </ModalOverlay>
      ) : null}
    </div>
  );
}

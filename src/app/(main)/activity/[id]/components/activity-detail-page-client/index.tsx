'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ActivityDetailContent } from '@/app/(main)/activity/[id]/components/activity-detail-content';
import { ActivityImageGallery } from '@/app/(main)/activity/[id]/components/activity-image-gallery';
import { ActivityInfoHeader } from '@/app/(main)/activity/[id]/components/activity-info-header';
import { ActivityReservationCard } from '@/app/(main)/activity/[id]/components/activity-reservation-card';
import { ActivityReviewsSection } from '@/app/(main)/activity/[id]/components/activity-reviews/activityReviewsSection';
import { fetchInstanceClient } from '@/shared/apis/fetchInstance.client';
import { useShowToast } from '@/shared/store/useToastStore';
import { ActivityDetailResponse } from '@/shared/types/activityDetail.types';

// TODO: 리뷰 조회 API 연동 후 제거
const MOCK_ACTIVITY_REVIEWS = {
  averageRating: 4.2,
  totalCount: 1300,
  reviews: [
    {
      id: 1,
      user: {
        profileImageUrl: '',
        nickname: '김태현',
        id: 101,
      },
      activityId: 1,
      rating: 5,
      content:
        '저는 저희 스트릿 댄서 체험에 참가하게 된 지 얼마 안 됐지만, 정말 즐거운 시간을 보냈습니다. 새로운 스타일과 춤추기를 좋아하는 나에게 정말 적합한 체험이었고, 전문가가 직접 강사로 참여하기 때문에 어떤 수준의 춤추는 사람도 쉽게 이해할 수 있었습니다. 강사님께서 정말 친절하게 설명해주셔서 정말 좋았고, 이번 체험을 거쳐 새로운 스타일과 춤추기에 대한 열정이 더욱 생겼습니다. 저는 이 체험을 적극 추천합니다!',
      createdAt: '2023-02-04T00:00:00.000Z',
      updatedAt: '2023-02-04T00:00:00.000Z',
    },
    {
      id: 2,
      user: {
        profileImageUrl: '',
        nickname: '조민선',
        id: 102,
      },
      activityId: 1,
      rating: 5,
      content:
        '저는 저희 스트릿 댄서 체험에 참가하게 된 지 얼마 안 됐지만 정말 즐거운 시간을 보냈습니다. 전문가가 직접 강사로 참여하기 때문에 어떤 수준의 춤추는 사람도 쉽게 이해할 수 있었고, 강사님의 친절한 설명 덕분에 저는 새로운 스타일과 춤추기에 대한 열정이 더욱 생겼습니다.',
      createdAt: '2023-02-04T00:00:00.000Z',
      updatedAt: '2023-02-04T00:00:00.000Z',
    },
    {
      id: 3,
      user: {
        profileImageUrl: '',
        nickname: '강지현',
        id: 103,
      },
      activityId: 1,
      rating: 5,
      content:
        '전문가가 직접 강사로 참여하기 때문에 어떤 수준의 춤추는 사람도 쉽게 이해할 수 있었습니다. 이번 체험을 거쳐 저의 춤추기 실력은 더욱 향상되었어요.',
      createdAt: '2023-02-04T00:00:00.000Z',
      updatedAt: '2023-02-04T00:00:00.000Z',
    },
  ],
};

const MOCK_REVIEW_TOTAL_PAGES = 5;

interface ActivityDetailPageClientProps {
  activity: ActivityDetailResponse;
  isOwner: boolean;
}

export function ActivityDetailPageClient({
  activity,
  isOwner,
}: ActivityDetailPageClientProps) {
  const router = useRouter();
  const showToast = useShowToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    router.push(`/activity/${activity.id}/edit`);
  };

  const handleDelete = async () => {
    if (isDeleting) {
      return;
    }

    const isConfirmed = window.confirm('정말 이 체험을 삭제하시겠습니까?');
    if (!isConfirmed) {
      return;
    }

    try {
      setIsDeleting(true);
      await fetchInstanceClient<unknown>(
        `/api/proxy/my-activities/${activity.id}`,
        {
          method: 'DELETE',
        }
      );

      showToast({
        theme: 'success',
        message: '체험이 삭제되었습니다.',
      });
      router.replace('/my/activities');
    } catch (error) {
      showToast({
        theme: 'error',
        message:
          error instanceof Error
            ? error.message
            : '체험 삭제 중 오류가 발생했습니다.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="py-6 pb-40 md:py-8 md:pb-40 2xl:py-10 2xl:pb-10">
      {/* 피그마 레이아웃 폭 기준: 모바일 327 / 태블릿 684 / PC 1200 (+좌우 40px) */}
      <div className="mx-auto w-full">
        <div className="flex flex-col gap-4 2xl:grid 2xl:grid-cols-5 2xl:items-start 2xl:gap-10">
          <div className="2xl:col-span-3">
            <ActivityImageGallery
              bannerImageUrl={activity.bannerImageUrl}
              subImageUrls={activity.subImages.map((image) => image.imageUrl)}
              title={activity.title}
              className="mb-5 md:mb-6 2xl:mb-10"
            />

            <div className="mb-5 border-b border-gray-100 pb-5 md:mb-8 md:pb-8 2xl:hidden">
              <ActivityInfoHeader
                category={activity.category}
                title={activity.title}
                rating={activity.rating}
                reviewCount={activity.reviewCount}
                address={activity.address}
                isOwner={isOwner}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>

            <ActivityDetailContent
              description={activity.description}
              address={activity.address}
            />
            <ActivityReviewsSection
              averageRating={MOCK_ACTIVITY_REVIEWS.averageRating}
              totalCount={MOCK_ACTIVITY_REVIEWS.totalCount}
              reviews={MOCK_ACTIVITY_REVIEWS.reviews}
              totalPages={MOCK_REVIEW_TOTAL_PAGES}
            />
          </div>

          <div className="2xl:col-span-2 2xl:self-stretch">
            <div className="mb-8 hidden w-full max-w-103 2xl:block">
              <ActivityInfoHeader
                category={activity.category}
                title={activity.title}
                rating={activity.rating}
                reviewCount={activity.reviewCount}
                address={activity.address}
                isOwner={isOwner}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
            {!isOwner && (
              <div className="2xl:sticky 2xl:top-24">
                <ActivityReservationCard />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { Metadata } from 'next';
import { ActivityDetailContent } from '@/app/(main)/activity/[id]/components/activity-detail-content';
import { ActivityImageGallery } from '@/app/(main)/activity/[id]/components/activity-image-gallery';
import { ActivityInfoHeader } from '@/app/(main)/activity/[id]/components/activity-info-header';
import { ActivityReservationCard } from '@/app/(main)/activity/[id]/components/activity-reservation-card';
import { ActivityReviewsSection } from '@/app/(main)/activity/[id]/components/activity-reviews/activityReviewsSection';

// TODO: 추후 API 연동 후 동적 메타데이터로 변경
export const metadata: Metadata = {
  title: '체험 이름',
};

// TODO: 추후 API 연동 시 제거 — getActivity(id) 로 대체
const MOCK_ACTIVITY = {
  id: 1,
  title: '함께 배우면 즐거운 스트릿 댄스',
  category: '문화 · 예술',
  rating: 4.9,
  reviewCount: 293,
  address: '서울 중구 청계천로 100 10F',
  description:
    '안녕하세요! 저희 스트릿 댄스 체험을 소개합니다. 저희는 신나고 재미있는 스트릿 댄스 스타일을 가르칩니다. 크럼프는 세계적으로 인기 있는 댄스 스타일로, 어디서든 춤출 수 있습니다. 저희 체험에서는 새로운 스타일을 접할 수 있고, 즐거운 시간을 보낼 수 있습니다. 저희는 초보자부터 전문가까지 어떤 수준의 춤추는 사람도 가르칠 수 있도록 준비해놓았습니다. 저희와 함께 즐길 수 있는 시간을 기대해주세요! 각종 음악에 적합한 스타일로, 저희는 크럼프 외에도 전통적인 스트릿 댄스 스타일과 최신 스트릿 댄스 스타일까지 가르칠 수 있습니다. 저희 체험에서는 전문가가 직접 강사로 참여하기 때문에, 저희가 제공하는 코스는 어떤 수준의 춤추는 사람도 쉽게 이해할 수 있도록 준비해놓았습니다. 저희 체험을 참가하게 된다면, 즐거운 시간 뿐만 아니라 새로운 스타일을 접할 수 있을 것입니다.',
  bannerImageUrl: '',
  subImageUrls: ['', ''],
  /** 내가 만든 체험 여부 — 로그인 유저 id와 체험 userId 비교로 결정 */
  isOwner: true,
};

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

export default function ActivityDetailPage() {
  const activity = MOCK_ACTIVITY;

  return (
    <div className="py-6 pb-[154px] md:py-8 md:pb-[156px] 2xl:py-10 2xl:pb-10">
      {/* 피그마 레이아웃 폭 기준: 모바일 327 / 태블릿 684 / PC 1200 (+좌우 40px) */}
      <div className="mx-auto w-full">
        <div className="flex flex-col gap-4 2xl:grid 2xl:grid-cols-5 2xl:items-start 2xl:gap-10">
          <div className="2xl:col-span-3">
            <ActivityImageGallery
              bannerImageUrl={activity.bannerImageUrl}
              subImageUrls={activity.subImageUrls}
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
                isOwner={activity.isOwner}
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
            <div className="mb-[30px] hidden w-full max-w-[410px] 2xl:block">
              <ActivityInfoHeader
                category={activity.category}
                title={activity.title}
                rating={activity.rating}
                reviewCount={activity.reviewCount}
                address={activity.address}
                isOwner={activity.isOwner}
              />
            </div>
            <div className="2xl:sticky 2xl:top-24">
              <ActivityReservationCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

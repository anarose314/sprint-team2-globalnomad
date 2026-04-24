import { Metadata } from 'next';
import { ActivityImageGallery } from '@/app/(main)/activity/[id]/components/activity-image-gallery';
import { ActivityInfoHeader } from '@/app/(main)/activity/[id]/components/activity-info-header';

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
  bannerImageUrl: '',
  subImageUrls: ['', ''],
  /** 내가 만든 체험 여부 — 로그인 유저 id와 체험 userId 비교로 결정 */
  isOwner: true,
};

export default function ActivityDetailPage() {
  const activity = MOCK_ACTIVITY;

  return (
<<<<<<< HEAD
    <main className="py-6 md:py-8 2xl:px-10 2xl:py-10">
      {/* 피그마 레이아웃 폭 기준: 모바일 327 / 태블릿 684 / PC 1200 (+좌우 40px) */}
      <div className="mx-auto w-full max-w-80 md:max-w-2xl 2xl:max-w-6xl">
        {/* ── 상단: 이미지 갤러리 + 타이틀 영역 ── */}
        {/* 모바일·태블릿: 세로 스택 / 데스크탑(2xl 1536px+): 이미지 좌 · 타이틀+예약카드 우 */}
        <div className="flex flex-col gap-4 2xl:mb-10 2xl:grid 2xl:grid-cols-5 2xl:items-start 2xl:gap-6">
          {/* 이미지 갤러리 (데스크탑: 좌측) */}
          <div className="2xl:col-span-3">
=======
    <main className="py-6 md:py-8 lg:px-10 lg:py-10">
      {/* 피그마 레이아웃 폭 기준: 모바일 327 / 태블릿 684 / PC 1200 (+좌우 40px) */}
      <div className="mx-auto w-full max-w-[327px] md:max-w-[684px] lg:max-w-[1200px]">
        {/* ── 상단: 이미지 갤러리 + 타이틀 영역 ── */}
        {/* 모바일·태블릿: 세로 스택 / 데스크탑(lg 1024px+): 이미지 좌 · 타이틀+예약카드 우 */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
          {/* 이미지 갤러리 (데스크탑: 좌측) */}
          <div className="lg:flex-3">
>>>>>>> 279d6d9 (✨ Feat: 체험 상세페이지 상단 이미지 갤러리 및 우측 타이틀 마크업)
            <ActivityImageGallery
              bannerImageUrl={activity.bannerImageUrl}
              subImageUrls={activity.subImageUrls}
              title={activity.title}
            />
          </div>

          {/* 타이틀 · 예약 카드 영역 (데스크탑: 우측) */}
<<<<<<< HEAD
          <div className="flex flex-col 2xl:col-span-2">
            <div className="mb-5 border-b border-gray-100 pb-5 md:mb-8 md:pb-8 2xl:mb-0 2xl:border-b-0 2xl:pb-0">
              <ActivityInfoHeader
                category={activity.category}
                title={activity.title}
                rating={activity.rating}
                reviewCount={activity.reviewCount}
                address={activity.address}
                isOwner={activity.isOwner}
              />
            </div>
=======
          <div className="flex flex-col gap-6 lg:flex-2">
            <ActivityInfoHeader
              category={activity.category}
              title={activity.title}
              rating={activity.rating}
              reviewCount={activity.reviewCount}
              address={activity.address}
              isOwner={activity.isOwner}
            />
>>>>>>> 279d6d9 (✨ Feat: 체험 상세페이지 상단 이미지 갤러리 및 우측 타이틀 마크업)

            {/* TODO: 예약 카드 (참여 인원, 캘린더, 시간 슬롯, 총합계, 예약하기 버튼) */}
          </div>
        </div>

        {/* ── 하단 본문 ── */}
        {/* TODO: 체험 설명 */}
        {/* TODO: 카카오 지도 */}
        {/* TODO: 체험 후기 (페이지네이션) */}
      </div>
    </main>
  );
}

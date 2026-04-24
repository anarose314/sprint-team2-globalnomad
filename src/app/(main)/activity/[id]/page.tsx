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
  isOwner: false,
};

export default function ActivityDetailPage() {
  const activity = MOCK_ACTIVITY;

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-6 md:px-6 lg:px-8 lg:py-10">
      {/* ── 상단: 이미지 갤러리 + 타이틀 영역 ── */}
      {/* 모바일·태블릿: 세로 스택 / 데스크탑(xl 1280px+): 이미지 좌 · 타이틀+예약카드 우 */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:gap-6">
        {/* 이미지 갤러리 (데스크탑: 좌측) */}
        <div className="xl:flex-3">
          <ActivityImageGallery
            bannerImageUrl={activity.bannerImageUrl}
            subImageUrls={activity.subImageUrls}
            title={activity.title}
          />
        </div>

        {/* 타이틀 · 예약 카드 영역 (데스크탑: 우측) */}
        <div className="flex flex-col gap-6 xl:flex-2">
          <ActivityInfoHeader
            category={activity.category}
            title={activity.title}
            rating={activity.rating}
            reviewCount={activity.reviewCount}
            address={activity.address}
            isOwner={activity.isOwner}
          />

          {/* TODO: 예약 카드 (참여 인원, 캘린더, 시간 슬롯, 총합계, 예약하기 버튼) */}
        </div>
      </div>

      {/* ── 하단 본문 ── */}
      {/* TODO: 체험 설명 */}
      {/* TODO: 카카오 지도 */}
      {/* TODO: 체험 후기 (페이지네이션) */}
    </main>
  );
}

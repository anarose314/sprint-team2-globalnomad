import { Metadata } from 'next';
import { ActivityDetailContent } from '@/app/(main)/activity/[id]/components/activity-detail-content';
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
  description:
    '안녕하세요! 저희 스트릿 댄스 체험을 소개합니다. 저희는 신나고 재미있는 스트릿 댄스 스타일을 가르칩니다. 크럼프는 세계적으로 인기 있는 댄스 스타일로, 어디서든 춤출 수 있습니다. 저희 체험에서는 새로운 스타일을 접할 수 있고, 즐거운 시간을 보낼 수 있습니다. 저희는 초보자부터 전문가까지 어떤 수준의 춤추는 사람도 가르칠 수 있도록 준비해놓았습니다. 저희와 함께 즐길 수 있는 시간을 기대해주세요! 각종 음악에 적합한 스타일로, 저희는 크럼프 외에도 전통적인 스트릿 댄스 스타일과 최신 스트릿 댄스 스타일까지 가르칠 수 있습니다. 저희 체험에서는 전문가가 직접 강사로 참여하기 때문에, 저희가 제공하는 코스는 어떤 수준의 춤추는 사람도 쉽게 이해할 수 있도록 준비해놓았습니다. 저희 체험을 참가하게 된다면, 즐거운 시간 뿐만 아니라 새로운 스타일을 접할 수 있을 것입니다.',
  bannerImageUrl: '',
  subImageUrls: ['', ''],
  /** 내가 만든 체험 여부 — 로그인 유저 id와 체험 userId 비교로 결정 */
  isOwner: true,
};

export default function ActivityDetailPage() {
  const activity = MOCK_ACTIVITY;

  return (
    <div className="py-6 md:py-8 2xl:py-10">
      {/* 피그마 레이아웃 폭 기준: 모바일 327 / 태블릿 684 / PC 1200 (+좌우 40px) */}
      <div className="mx-auto w-full">
        {/* ── 상단: 이미지 갤러리 + 타이틀 영역 ── */}
        {/* 모바일·태블릿: 세로 스택 / 데스크탑(2xl 1536px+): 이미지 좌 · 타이틀+예약카드 우 */}
        <div className="flex flex-col gap-4 2xl:mb-10 2xl:grid 2xl:grid-cols-5 2xl:items-start 2xl:gap-6">
          {/* 이미지 갤러리 (데스크탑: 좌측) */}
          <div className="2xl:col-span-3">
            <ActivityImageGallery
              bannerImageUrl={activity.bannerImageUrl}
              subImageUrls={activity.subImageUrls}
              title={activity.title}
            />
          </div>

          {/* 타이틀 · 예약 카드 영역 (데스크탑: 우측) */}
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

            {/* TODO: 예약 카드 (참여 인원, 캘린더, 시간 슬롯, 총합계, 예약하기 버튼) */}
          </div>
        </div>

        {/* ── 하단 본문 ── */}
        <div className="2xl:grid 2xl:grid-cols-5 2xl:gap-6">
          {/* PC에서 이미지 갤러리와 동일한 비율(3/5) */}
          <div>
            <ActivityDetailContent
              description={activity.description}
              address={activity.address}
            />
          </div>

          {/* 우측 예약 영역 폭 확보 */}
          <div className="hidden 2xl:col-span-2 2xl:block" />
        </div>
        {/* TODO: 체험 후기 (페이지네이션) */}
      </div>
    </div>
  );
}

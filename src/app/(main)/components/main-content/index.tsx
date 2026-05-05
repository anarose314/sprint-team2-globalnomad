import { AllActivitySection } from '@/app/(main)/components/all-activity-section';
import { MainBanner } from '@/app/(main)/components/main-banner';
import { MainSearch } from '@/app/(main)/components/main-search';
import { PopularActivitySection } from '@/app/(main)/components/popular-activity-section';
import { POPULAR_ACTIVITIES } from '@/app/(main)/main.constants';

/**
/**
 * 메인 페이지 콘텐츠 조립 컴포넌트
 *
 * - 배너, 검색, 인기 체험, 모든 체험 섹션을 순서대로 조립한다.
 *
 * @example
 * <MainContent />
 */
export function MainContent() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <MainBanner />
      <MainSearch />
      <PopularActivitySection activities={POPULAR_ACTIVITIES} />
      <AllActivitySection />
    </div>
  );
}

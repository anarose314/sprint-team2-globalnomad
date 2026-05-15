import { MainBanner } from '@/app/(main)/components/main-banner';
import { MainInteractiveContent } from '@/app/(main)/components/main-interactive-content';

/**
 * 메인 페이지 콘텐츠 조립 컴포넌트
 *
 * - 서버 컴포넌트로 유지하여 정적인 배너 영역을 렌더링한다.
 * - 검색, 필터, 정렬처럼 상태가 필요한 영역은 클라이언트 컴포넌트에서 관리한다.
 *
 * @example
 * <MainContent />
 */
export function MainContent() {
  return (
    <div className="mt-15 flex flex-col gap-16 pb-20">
      <MainBanner />
      <MainInteractiveContent />
    </div>
  );
}

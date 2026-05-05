import { MAIN_BANNER } from '@/app/(main)/main.constants';

/**
 * 메인 페이지 상단 배너 컴포넌트
 *
 * - 이미지 영역의 크기와 텍스트 배치를 먼저 구현한다.
 * - 실제 이미지는 API 연동 단계에서 bannerImageUrl로 교체할 예정이다.
 *
 * @example
 * <MainBanner />
 */
export function MainBanner() {
  return (
    <section className="mx-auto w-full max-w-280 px-4 md:px-0">
      <div className="relative h-45 overflow-hidden rounded-3xl bg-gray-300 md:h-80 2xl:h-125">
        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-5 text-center">
          <h1 className="typo-xl-bold md:typo-2xl-bold 2xl:typo-3xl-bold text-white">
            {MAIN_BANNER.title}
          </h1>
          <p className="typo-md-semibold md:typo-lg-semibold text-white">
            {MAIN_BANNER.description}
          </p>
        </div>
      </div>
    </section>
  );
}

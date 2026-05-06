import { MAIN_BANNER } from '@/app/(main)/main.constants';
import { Heading } from '@/shared/components/heading';

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
    <section className="mt-15">
      <div className="relative h-45 overflow-hidden rounded-3xl bg-gray-300 md:h-93.75 2xl:h-125">
        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute inset-0 flex translate-y-6 flex-col items-center justify-center gap-2 px-5 text-center md:translate-y-14 2xl:translate-y-18">
          <Heading
            as="h2"
            textStyle="typo-xl-bold"
            className="md:typo-2xl-bold 2xl:typo-3xl-bold text-white"
          >
            {MAIN_BANNER.title}
          </Heading>
          <p className="typo-md-semibold md:typo-lg-semibold 2xl:typo-2lg-semibold text-white">
            {MAIN_BANNER.description}
          </p>
        </div>
      </div>
    </section>
  );
}

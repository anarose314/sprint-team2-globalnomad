import Image from 'next/image';
import {
  MAIN_BANNER,
  MAIN_DESKTOP_PAGE_SIZE_MEDIA_QUERY,
} from '@/app/(main)/main.constants';
import { Heading } from '@/shared/components/heading';

/**
 * 메인 페이지 상단 배너 컴포넌트
 *
 * - 프론트에서 하드코딩한 배너 이미지와 문구를 표시한다.
 * - 이미지 위에 어두운 오버레이를 올려 텍스트 가독성을 확보한다.
 *
 * @example
 * <MainBanner />
 */
export function MainBanner() {
  return (
    <section>
      <div className="relative h-45 overflow-hidden rounded-3xl bg-gray-300 md:h-93.75 2xl:h-125">
        <Image
          src="/main.webp"
          alt=""
          fill
          priority
          sizes={`${MAIN_DESKTOP_PAGE_SIZE_MEDIA_QUERY} 1120px, 100vw`}
          className="object-cover"
        />

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

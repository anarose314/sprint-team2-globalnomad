'use client';

import { IcMap } from '@/shared/assets/icons';
import { Heading } from '@/shared/components/heading';
import { useKakaoMap } from '@/shared/hooks/useKakaoMap';
import { cn } from '@/shared/utils/cn';

interface ActivityDetailContentProps {
  description: string;
  address: string;
  className?: string;
}

export function ActivityDetailContent({
  description,
  address,
  className,
}: ActivityDetailContentProps) {
  const appKey = (process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY ?? '').trim();
  const { mapContainerRef, isMapLoading, mapErrorMessage } = useKakaoMap({
    address,
    appKey,
  });

  return (
    <section className={cn('w-full', className)}>
      <div className="mb-5 border-b border-gray-100 pb-5 md:mb-8 md:pb-8 2xl:mb-10 2xl:pb-10">
        <Heading as="h3">체험 설명</Heading>
        <p className="typo-lg-medium mt-4 whitespace-pre-line text-gray-950">
          {description}
        </p>
      </div>

      <div className="mb-5 border-b border-gray-100 pb-5 md:mb-8 md:pb-8 2xl:mb-10 2xl:pb-10">
        <Heading as="h3">오시는 길</Heading>
        <div className="mt-2 flex items-center gap-1">
          <IcMap aria-hidden="true" className="size-4 shrink-0 text-black" />
          <p className="typo-md-semibold text-gray-950">{address}</p>
        </div>

        <div
          ref={mapContainerRef}
          className="relative mt-4 h-60 w-full overflow-hidden rounded-2xl bg-gray-100 md:h-80 md:rounded-3xl 2xl:h-96"
        >
          {isMapLoading && !mapErrorMessage && (
            <p className="typo-md-medium absolute inset-0 flex items-center justify-center text-gray-600">
              지도 정보를 불러오는 중입니다.
            </p>
          )}
          {mapErrorMessage && (
            <p className="typo-md-medium absolute inset-0 flex items-center justify-center text-gray-600">
              {mapErrorMessage}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

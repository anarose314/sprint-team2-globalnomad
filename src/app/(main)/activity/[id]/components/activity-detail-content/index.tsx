'use client';

import { IcCopy, IcMap } from '@/shared/assets/icons';
import { Heading } from '@/shared/components/heading';
import { useKakaoMap } from '@/shared/hooks/useKakaoMap';
import { useShowToast } from '@/shared/store/useToastStore';
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
  const showToast = useShowToast();
  const appKey = (process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY ?? '').trim();
  const appBaseUrl = (process.env.NEXT_PUBLIC_APP_URL ?? '').trim();
  const allowedHostnames = new Set<string>(['localhost', '127.0.0.1']);
  if (appBaseUrl) {
    try {
      allowedHostnames.add(new URL(appBaseUrl).hostname);
    } catch {
      // 잘못된 환경 변수 형식은 런타임 오류 대신 기본 허용 호스트만 사용한다.
    }
  }
  const currentHostname =
    typeof window === 'undefined' ? '' : window.location.hostname;
  const isMapEnabled =
    currentHostname !== '' && allowedHostnames.has(currentHostname);
  const { mapContainerRef, isMapLoading, mapErrorMessage } = useKakaoMap({
    address,
    appKey,
    isEnabled: isMapEnabled,
  });
  const handleCopyAddress = async () => {
    if (!navigator.clipboard) {
      showToast({
        theme: 'error',
        message: '클립보드 복사를 지원하지 않는 브라우저입니다.',
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(address);
      showToast({
        theme: 'success',
        message: '주소가 복사되었습니다.',
      });
    } catch {
      showToast({
        theme: 'error',
        message: '주소 복사에 실패했습니다.',
      });
    }
  };

  return (
    <section className={cn('w-full', className)}>
      <div className="mb-5 border-b border-gray-100 pb-5 md:mb-8 md:pb-8 2xl:mb-10 2xl:pb-10">
        <Heading as="h2">체험 설명</Heading>
        <p className="typo-lg-medium mt-4 wrap-anywhere whitespace-pre-line text-gray-950">
          {description}
        </p>
      </div>

      <div className="mb-5 border-b border-gray-100 pb-5 md:mb-8 md:pb-8 2xl:mb-10 2xl:pb-10">
        <Heading as="h2">오시는 길</Heading>
        <div className="mt-2 flex items-center gap-1">
          <IcMap aria-hidden="true" className="size-4 shrink-0 text-black" />
          <p className="typo-md-semibold text-gray-950">{address}</p>
          <button
            type="button"
            onClick={handleCopyAddress}
            aria-label="주소 복사"
            className="text-gray-850 ml-1 inline-flex shrink-0 cursor-pointer items-center justify-center rounded p-1 transition-colors hover:bg-gray-100"
          >
            <IcCopy aria-hidden="true" className="block size-[14px] shrink-0" />
          </button>
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

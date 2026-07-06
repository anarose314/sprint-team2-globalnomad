'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/shared/utils/cn';

/** `src`가 바뀔 때마다 리마운트되어 로드 상태가 초기화됨 */
function GalleryImageSlotInner({
  src,
  alt,
  sizes,
  quality = 70,
  priority = false,
  loading,
}: {
  src: string;
  alt: string;
  sizes: string;
  quality?: number;
  priority?: boolean;
  loading?: 'eager' | 'lazy';
}) {
  /**
   * next/image 제약: priority와 loading은 동시 사용 불가.
   * 호출부에서 함께 넘겨도 안전하도록 priority 우선으로 정규화한다.
   */
  const normalizedLoading = priority ? undefined : loading;

  /**
   * LCP 후보(우선 로딩) 이미지는 첫 페인트에서 바로 보이게 처리해
   * hydration 이후 onLoad/setState 대기 때문에 생기는 렌더 지연을 줄인다.
   */
  const shouldFadeIn = !(priority || normalizedLoading === 'eager');
  const [loaded, setLoaded] = useState(!shouldFadeIn);

  const handleImgRef = useCallback(
    (el: HTMLImageElement | null) => {
      if (!shouldFadeIn) {
        return;
      }
      if (el?.complete && el.naturalWidth > 0) {
        setLoaded(true);
      }
    },
    [shouldFadeIn]
  );

  return (
    <>
      {shouldFadeIn && !loaded ? (
        <div
          className="skeleton-shimmer pointer-events-none absolute inset-0 z-0"
          aria-hidden
        />
      ) : null}
      <Image
        ref={handleImgRef}
        src={src}
        alt={alt}
        fill
        priority={priority}
        loading={normalizedLoading}
        sizes={sizes}
        quality={quality}
        className={cn(
          'object-cover',
          shouldFadeIn && 'transition-opacity duration-300',
          loaded ? 'opacity-100' : 'opacity-0'
        )}
        onLoad={shouldFadeIn ? () => setLoaded(true) : undefined}
        onError={shouldFadeIn ? () => setLoaded(true) : undefined}
      />
    </>
  );
}

const gallerySlotClassName = 'relative min-h-0 overflow-hidden bg-gray-100';

export function GalleryImageSlot({
  src,
  alt,
  ariaLabel,
  className,
  sizes = '(max-width: 768px) 100vw, 50vw',
  quality = 70,
  onOpen,
  priority = false,
  loading,
}: {
  src?: string;
  alt: string;
  ariaLabel?: string;
  className?: string;
  sizes?: string;
  quality?: number;
  onOpen?: () => void;
  priority?: boolean;
  loading?: 'eager' | 'lazy';
}) {
  const mergedClass = cn(gallerySlotClassName, className);

  if (onOpen) {
    return (
      <button
        type="button"
        onClick={onOpen}
        aria-label={ariaLabel ?? '이미지 크게 보기'}
        className={cn(
          mergedClass,
          'm-0 block size-full cursor-pointer border-0 p-0 text-left'
        )}
      >
        {src ? (
          <GalleryImageSlotInner
            key={src}
            src={src}
            alt={alt}
            sizes={sizes}
            quality={quality}
            priority={priority}
            loading={loading}
          />
        ) : null}
      </button>
    );
  }

  return (
    <div className={mergedClass}>
      {src ? (
        <GalleryImageSlotInner
          key={src}
          src={src}
          alt={alt}
          sizes={sizes}
          quality={quality}
          priority={priority}
          loading={loading}
        />
      ) : null}
    </div>
  );
}

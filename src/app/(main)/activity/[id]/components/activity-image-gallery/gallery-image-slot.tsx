'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/shared/utils/cn';

/** `src`가 바뀔 때마다 리마운트되어 로드 상태가 초기화됨 */
function GalleryImageSlotInner({
  src,
  alt,
  sizes,
  priority = false,
  fetchPriority = 'auto',
  loading,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  fetchPriority?: 'high' | 'low' | 'auto';
  loading?: 'eager' | 'lazy';
}) {
  /**
   * LCP 후보(우선 로딩) 이미지는 첫 페인트에서 바로 보이게 처리해
   * hydration 이후 onLoad/setState 대기 때문에 생기는 렌더 지연을 줄인다.
   */
  const shouldFadeIn = !(priority || loading === 'eager');
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
        fetchPriority={fetchPriority}
        loading={loading}
        sizes={sizes}
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
  className,
  sizes = '(max-width: 768px) 100vw, 50vw',
  onOpen,
  priority = false,
  fetchPriority = 'auto',
  loading,
}: {
  src?: string;
  alt: string;
  className?: string;
  sizes?: string;
  onOpen?: () => void;
  priority?: boolean;
  fetchPriority?: 'high' | 'low' | 'auto';
  loading?: 'eager' | 'lazy';
}) {
  const mergedClass = cn(gallerySlotClassName, className);

  if (onOpen) {
    return (
      <button
        type="button"
        onClick={onOpen}
        aria-label="이미지 크게 보기"
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
            priority={priority}
            fetchPriority={fetchPriority}
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
          priority={priority}
          fetchPriority={fetchPriority}
          loading={loading}
        />
      ) : null}
    </div>
  );
}

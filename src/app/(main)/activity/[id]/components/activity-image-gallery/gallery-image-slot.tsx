'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/shared/utils/cn';

/** `src`가 바뀔 때마다 리마운트되어 로드 상태가 초기화됨 */
function GalleryImageSlotInner({
  src,
  alt,
  sizes,
}: {
  src: string;
  alt: string;
  sizes: string;
}) {
  const [loaded, setLoaded] = useState(false);

  const handleImgRef = useCallback((el: HTMLImageElement | null) => {
    if (el?.complete && el.naturalWidth > 0) {
      setLoaded(true);
    }
  }, []);

  return (
    <>
      {!loaded ? (
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
        sizes={sizes}
        className={cn(
          'object-cover transition-opacity duration-300',
          loaded ? 'opacity-100' : 'opacity-0'
        )}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
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
}: {
  src?: string;
  alt: string;
  className?: string;
  sizes?: string;
  onOpen?: () => void;
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
          <GalleryImageSlotInner key={src} src={src} alt={alt} sizes={sizes} />
        ) : null}
      </button>
    );
  }

  return (
    <div className={mergedClass}>
      {src ? (
        <GalleryImageSlotInner key={src} src={src} alt={alt} sizes={sizes} />
      ) : null}
    </div>
  );
}

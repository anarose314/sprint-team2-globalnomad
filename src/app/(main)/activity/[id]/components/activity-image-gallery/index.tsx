'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { ACTIVITY_IMAGE_GALLERY_FRAME_CLASS } from '@/app/(main)/activity/[id]/components/activity-image-gallery/constants';
import { cn } from '@/shared/utils/cn';

interface ActivityImageGalleryProps {
  bannerImageUrl?: string;
  subImageUrls?: string[];
  title?: string;
  className?: string;
}

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

function GalleryImageSlot({
  src,
  alt,
  className,
  sizes = '(max-width: 768px) 100vw, 50vw',
}: {
  src?: string;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  return (
    <div
      className={cn('relative min-h-0 overflow-hidden bg-gray-100', className)}
    >
      {src ? (
        <GalleryImageSlotInner key={src} src={src} alt={alt} sizes={sizes} />
      ) : null}
    </div>
  );
}

/**
 * 체험 상세 페이지 이미지 갤러리
 *
 * @example
 * <ActivityImageGallery
 *   bannerImageUrl={activity.bannerImageUrl}
 *   subImageUrls={activity.subImages.map(img => img.imageUrl)}
 *   title={activity.title}
 * />
 */
export function ActivityImageGallery({
  bannerImageUrl,
  subImageUrls = [],
  title = '체험',
  className,
}: ActivityImageGalleryProps) {
  const imageUrls = [
    ...(bannerImageUrl ? [bannerImageUrl] : []),
    ...subImageUrls.filter(Boolean),
  ];
  const count = imageUrls.length;

  if (count === 0) {
    return (
      <div
        className={cn(
          ACTIVITY_IMAGE_GALLERY_FRAME_CLASS,
          'bg-gray-100',
          className
        )}
      />
    );
  }

  if (count === 1) {
    return (
      <div
        className={cn(
          ACTIVITY_IMAGE_GALLERY_FRAME_CLASS,
          'relative',
          className
        )}
      >
        <GalleryImageSlot
          src={imageUrls[0]}
          alt={title}
          className="h-full w-full"
          sizes="(max-width: 768px) 100vw, 75vw"
        />
      </div>
    );
  }

  if (count === 2) {
    return (
      <div
        className={cn(
          ACTIVITY_IMAGE_GALLERY_FRAME_CLASS,
          'flex min-h-0 flex-col gap-2',
          className
        )}
      >
        <GalleryImageSlot
          src={imageUrls[0]}
          alt={`${title} 이미지 1`}
          className="min-h-0 flex-1"
          sizes="(max-width: 768px) 100vw, 75vw"
        />
        <GalleryImageSlot
          src={imageUrls[1]}
          alt={`${title} 이미지 2`}
          className="min-h-0 flex-1"
          sizes="(max-width: 768px) 100vw, 75vw"
        />
      </div>
    );
  }

  if (count === 3) {
    return (
      <div
        className={cn(
          ACTIVITY_IMAGE_GALLERY_FRAME_CLASS,
          'grid grid-cols-2 grid-rows-2 gap-2',
          className
        )}
      >
        <GalleryImageSlot
          src={imageUrls[0]}
          alt={title}
          className="row-span-2 h-full min-h-0"
        />
        <div className="row-span-2 flex h-full min-h-0 flex-col gap-2">
          <GalleryImageSlot
            src={imageUrls[1]}
            alt={`${title} 추가 이미지 1`}
            className="min-h-0 flex-1"
          />
          <GalleryImageSlot
            src={imageUrls[2]}
            alt={`${title} 추가 이미지 2`}
            className="min-h-0 flex-1"
          />
        </div>
      </div>
    );
  }

  const quad = imageUrls.slice(0, 4);

  return (
    <div
      className={cn(
        ACTIVITY_IMAGE_GALLERY_FRAME_CLASS,
        'grid min-h-0 grid-cols-2 grid-rows-2 gap-2',
        className
      )}
    >
      {quad.map((url, index) => (
        <GalleryImageSlot
          key={`${url}-${index}`}
          src={url}
          alt={`${title} 이미지 ${index + 1}`}
          className="min-h-0"
          sizes="(max-width: 768px) 50vw, 38vw"
        />
      ))}
    </div>
  );
}

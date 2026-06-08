'use client';

import { useState } from 'react';
import { ActivityImageLightbox } from '@/app/(main)/activity/[id]/components/activity-image-gallery/activity-image-lightbox';
import { GalleryImageSlot } from '@/app/(main)/activity/[id]/components/activity-image-gallery/gallery-image-slot';
import { ACTIVITY_IMAGE_GALLERY_FRAME_CLASS } from '@/shared/constants/activityImageGallery.constants';
import { cn } from '@/shared/utils/cn';

interface ActivityImageGalleryProps {
  bannerImageUrl?: string;
  subImageUrls?: string[];
  title?: string;
  className?: string;
}

const DESKTOP_MAIN_IMAGE_SIZES =
  '(max-width: 768px) 100vw, (max-width: 1536px) 75vw, 672px';
const DESKTOP_GRID_IMAGE_SIZES =
  '(max-width: 768px) 50vw, (max-width: 1536px) 38vw, 336px';
const LCP_IMAGE_QUALITY = 75;
const REGULAR_IMAGE_QUALITY = 68;

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
  /** 갤러리에 최대 5장만 노출; 라이트박스도 동일 목록 사용 */
  const lightboxUrls = imageUrls;

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const lightbox =
    lightboxIndex !== null && lightboxUrls[lightboxIndex] ? (
      <ActivityImageLightbox
        urls={lightboxUrls}
        title={title}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    ) : null;

  if (count === 0) {
    return (
      <>
        <div
          className={cn(
            ACTIVITY_IMAGE_GALLERY_FRAME_CLASS,
            'bg-gray-100',
            className
          )}
        />
        {lightbox}
      </>
    );
  }

  if (count === 1) {
    return (
      <>
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
            sizes={DESKTOP_MAIN_IMAGE_SIZES}
            quality={LCP_IMAGE_QUALITY}
            priority
            onOpen={() => setLightboxIndex(0)}
          />
        </div>
        {lightbox}
      </>
    );
  }

  if (count === 2) {
    return (
      <>
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
            sizes={DESKTOP_MAIN_IMAGE_SIZES}
            quality={LCP_IMAGE_QUALITY}
            priority
            onOpen={() => setLightboxIndex(0)}
          />
          <GalleryImageSlot
            src={imageUrls[1]}
            alt={`${title} 이미지 2`}
            className="min-h-0 flex-1"
            sizes={DESKTOP_MAIN_IMAGE_SIZES}
            quality={REGULAR_IMAGE_QUALITY}
            onOpen={() => setLightboxIndex(1)}
          />
        </div>
        {lightbox}
      </>
    );
  }

  if (count === 3) {
    return (
      <>
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
            sizes={DESKTOP_GRID_IMAGE_SIZES}
            quality={LCP_IMAGE_QUALITY}
            priority
            onOpen={() => setLightboxIndex(0)}
          />
          <div className="row-span-2 flex h-full min-h-0 flex-col gap-2">
            <GalleryImageSlot
              src={imageUrls[1]}
              alt={`${title} 추가 이미지 1`}
              className="min-h-0 flex-1"
              sizes={DESKTOP_GRID_IMAGE_SIZES}
              quality={REGULAR_IMAGE_QUALITY}
              onOpen={() => setLightboxIndex(1)}
            />
            <GalleryImageSlot
              src={imageUrls[2]}
              alt={`${title} 추가 이미지 2`}
              className="min-h-0 flex-1"
              sizes={DESKTOP_GRID_IMAGE_SIZES}
              quality={REGULAR_IMAGE_QUALITY}
              onOpen={() => setLightboxIndex(2)}
            />
          </div>
        </div>
        {lightbox}
      </>
    );
  }

  if (count === 4) {
    return (
      <>
        <div
          className={cn(
            ACTIVITY_IMAGE_GALLERY_FRAME_CLASS,
            'grid min-h-0 grid-cols-2 grid-rows-2 gap-2',
            className
          )}
        >
          {imageUrls.map((url, index) => (
            <GalleryImageSlot
              key={`${url}-${index}`}
              src={url}
              alt={`${title} 이미지 ${index + 1}`}
              className="min-h-0"
              sizes={DESKTOP_GRID_IMAGE_SIZES}
              quality={index === 0 ? LCP_IMAGE_QUALITY : REGULAR_IMAGE_QUALITY}
              priority={index === 0}
              loading="lazy"
              onOpen={() => setLightboxIndex(index)}
            />
          ))}
        </div>
        {lightbox}
      </>
    );
  }

  const five = imageUrls.slice(0, 5);

  return (
    <>
      <div
        className={cn(
          ACTIVITY_IMAGE_GALLERY_FRAME_CLASS,
          'flex min-h-0 gap-2',
          className
        )}
      >
        <div className="flex min-h-0 w-1/2 min-w-0 flex-1 flex-col gap-2">
          <GalleryImageSlot
            src={five[0]}
            alt={`${title} 이미지 1`}
            className="min-h-0 flex-1"
            sizes={DESKTOP_GRID_IMAGE_SIZES}
            quality={LCP_IMAGE_QUALITY}
            priority
            onOpen={() => setLightboxIndex(0)}
          />
          <GalleryImageSlot
            src={five[1]}
            alt={`${title} 이미지 2`}
            className="min-h-0 flex-1"
            sizes={DESKTOP_GRID_IMAGE_SIZES}
            quality={REGULAR_IMAGE_QUALITY}
            onOpen={() => setLightboxIndex(1)}
          />
        </div>
        <div className="flex min-h-0 w-1/2 min-w-0 flex-1 flex-col gap-2">
          <GalleryImageSlot
            src={five[2]}
            alt={`${title} 이미지 3`}
            className="min-h-0 flex-1"
            sizes={DESKTOP_GRID_IMAGE_SIZES}
            quality={REGULAR_IMAGE_QUALITY}
            onOpen={() => setLightboxIndex(2)}
          />
          <GalleryImageSlot
            src={five[3]}
            alt={`${title} 이미지 4`}
            className="min-h-0 flex-1"
            sizes={DESKTOP_GRID_IMAGE_SIZES}
            quality={REGULAR_IMAGE_QUALITY}
            onOpen={() => setLightboxIndex(3)}
          />
          <GalleryImageSlot
            src={five[4]}
            alt={`${title} 이미지 5`}
            className="min-h-0 flex-1"
            sizes={DESKTOP_GRID_IMAGE_SIZES}
            quality={REGULAR_IMAGE_QUALITY}
            onOpen={() => setLightboxIndex(4)}
          />
        </div>
      </div>
      {lightbox}
    </>
  );
}

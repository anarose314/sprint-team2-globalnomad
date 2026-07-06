'use client';

import { useState } from 'react';
import { ActivityImageLightbox } from '@/app/(main)/activity/[id]/components/activity-image-gallery/activity-image-lightbox';
import { GalleryImageSlot } from '@/app/(main)/activity/[id]/components/activity-image-gallery/gallery-image-slot';
import { ACTIVITY_IMAGE_GALLERY_FRAME_CLASS } from '@/shared/constants/activityImageGallery.constants';
import { cn } from '@/shared/utils/cn';
import { resolveSafeImageUrl } from '@/shared/utils/resolveSafeImageUrl';

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

interface GallerySlotConfig {
  index: number;
  alt: string;
  className: string;
  sizes: string;
  quality: number;
  priority?: boolean;
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
  const imageBaseUrl =
    process.env.NEXT_PUBLIC_IMAGE_URL?.trim() ??
    process.env.NEXT_PUBLIC_APP_URL?.trim() ??
    'https://globalnomad-team2.vercel.app';
  const normalizedBannerUrl = resolveSafeImageUrl(bannerImageUrl, imageBaseUrl);
  const normalizedSubImageUrls = subImageUrls
    .map((url) => resolveSafeImageUrl(url, imageBaseUrl))
    .filter((url): url is string => Boolean(url));
  const imageUrls = [
    ...(normalizedBannerUrl ? [normalizedBannerUrl] : []),
    ...normalizedSubImageUrls,
  ];
  const count = imageUrls.length;
  /** 갤러리에 최대 5장만 노출; 라이트박스도 동일 목록 사용 */
  const lightboxUrls = imageUrls;

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const renderSlot = ({
    index,
    alt,
    className: slotClassName,
    sizes,
    quality,
    priority,
  }: GallerySlotConfig) => {
    const url = imageUrls[index];
    if (!url) return null;

    return (
      <GalleryImageSlot
        key={`${url}-${index}`}
        src={url}
        alt={alt}
        ariaLabel={`${alt} 크게 보기`}
        className={slotClassName}
        sizes={sizes}
        quality={quality}
        priority={priority}
        onOpen={() => setLightboxIndex(index)}
      />
    );
  };

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
    const slots: GallerySlotConfig[] = [
      {
        index: 0,
        alt: title,
        className: 'h-full w-full',
        sizes: DESKTOP_MAIN_IMAGE_SIZES,
        quality: LCP_IMAGE_QUALITY,
        priority: true,
      },
    ];

    return (
      <>
        <div
          className={cn(
            ACTIVITY_IMAGE_GALLERY_FRAME_CLASS,
            'relative',
            className
          )}
        >
          {slots.map(renderSlot)}
        </div>
        {lightbox}
      </>
    );
  }

  if (count === 2) {
    const slots: GallerySlotConfig[] = [
      {
        index: 0,
        alt: `${title} 이미지 1`,
        className: 'min-h-0 flex-1',
        sizes: DESKTOP_MAIN_IMAGE_SIZES,
        quality: LCP_IMAGE_QUALITY,
        priority: true,
      },
      {
        index: 1,
        alt: `${title} 이미지 2`,
        className: 'min-h-0 flex-1',
        sizes: DESKTOP_MAIN_IMAGE_SIZES,
        quality: REGULAR_IMAGE_QUALITY,
      },
    ];

    return (
      <>
        <div
          className={cn(
            ACTIVITY_IMAGE_GALLERY_FRAME_CLASS,
            'flex min-h-0 flex-col gap-2',
            className
          )}
        >
          {slots.map(renderSlot)}
        </div>
        {lightbox}
      </>
    );
  }

  if (count === 3) {
    const mainSlot: GallerySlotConfig = {
      index: 0,
      alt: title,
      className: 'row-span-2 h-full min-h-0',
      sizes: DESKTOP_GRID_IMAGE_SIZES,
      quality: LCP_IMAGE_QUALITY,
      priority: true,
    };
    const rightSlots: GallerySlotConfig[] = [
      {
        index: 1,
        alt: `${title} 추가 이미지 1`,
        className: 'min-h-0 flex-1',
        sizes: DESKTOP_GRID_IMAGE_SIZES,
        quality: REGULAR_IMAGE_QUALITY,
      },
      {
        index: 2,
        alt: `${title} 추가 이미지 2`,
        className: 'min-h-0 flex-1',
        sizes: DESKTOP_GRID_IMAGE_SIZES,
        quality: REGULAR_IMAGE_QUALITY,
      },
    ];

    return (
      <>
        <div
          className={cn(
            ACTIVITY_IMAGE_GALLERY_FRAME_CLASS,
            'grid grid-cols-2 grid-rows-2 gap-2',
            className
          )}
        >
          {renderSlot(mainSlot)}
          <div className="row-span-2 flex h-full min-h-0 flex-col gap-2">
            {rightSlots.map(renderSlot)}
          </div>
        </div>
        {lightbox}
      </>
    );
  }

  if (count === 4) {
    const slots: GallerySlotConfig[] = imageUrls.map((_, index) => ({
      index,
      alt: `${title} 이미지 ${index + 1}`,
      className: 'min-h-0',
      sizes: DESKTOP_GRID_IMAGE_SIZES,
      quality: index === 0 ? LCP_IMAGE_QUALITY : REGULAR_IMAGE_QUALITY,
      priority: index === 0,
    }));

    return (
      <>
        <div
          className={cn(
            ACTIVITY_IMAGE_GALLERY_FRAME_CLASS,
            'grid min-h-0 grid-cols-2 grid-rows-2 gap-2',
            className
          )}
        >
          {slots.map(renderSlot)}
        </div>
        {lightbox}
      </>
    );
  }

  const leftSlots: GallerySlotConfig[] = [
    {
      index: 0,
      alt: `${title} 이미지 1`,
      className: 'min-h-0 flex-1',
      sizes: DESKTOP_GRID_IMAGE_SIZES,
      quality: LCP_IMAGE_QUALITY,
      priority: true,
    },
    {
      index: 1,
      alt: `${title} 이미지 2`,
      className: 'min-h-0 flex-1',
      sizes: DESKTOP_GRID_IMAGE_SIZES,
      quality: REGULAR_IMAGE_QUALITY,
    },
  ];
  const rightSlots: GallerySlotConfig[] = [
    {
      index: 2,
      alt: `${title} 이미지 3`,
      className: 'min-h-0 flex-1',
      sizes: DESKTOP_GRID_IMAGE_SIZES,
      quality: REGULAR_IMAGE_QUALITY,
    },
    {
      index: 3,
      alt: `${title} 이미지 4`,
      className: 'min-h-0 flex-1',
      sizes: DESKTOP_GRID_IMAGE_SIZES,
      quality: REGULAR_IMAGE_QUALITY,
    },
    {
      index: 4,
      alt: `${title} 이미지 5`,
      className: 'min-h-0 flex-1',
      sizes: DESKTOP_GRID_IMAGE_SIZES,
      quality: REGULAR_IMAGE_QUALITY,
    },
  ];

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
          {leftSlots.map(renderSlot)}
        </div>
        <div className="flex min-h-0 w-1/2 min-w-0 flex-1 flex-col gap-2">
          {rightSlots.map(renderSlot)}
        </div>
      </div>
      {lightbox}
    </>
  );
}

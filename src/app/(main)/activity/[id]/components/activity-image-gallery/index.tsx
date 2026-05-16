'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  IcArrowNaviLeft,
  IcArrowNaviRight,
  IcClose,
} from '@/shared/assets/icons';
import { ModalOverlay } from '@/shared/components/modal/modal-overlay';
import { ACTIVITY_IMAGE_GALLERY_FRAME_CLASS } from '@/shared/constants/activityImageGallery.constants';
import { cn } from '@/shared/utils/cn';

/** `object-contain`으로 그려진 비트맵 영역(레터박스 제외) 안인지 */
function isPointerOnObjectContainContent(
  clientX: number,
  clientY: number,
  containerRect: DOMRect,
  img: HTMLImageElement
): boolean {
  const nw = img.naturalWidth;
  const nh = img.naturalHeight;
  if (nw <= 0 || nh <= 0) return false;
  const { width: cw, height: ch, left: cl, top: ct } = containerRect;
  const scale = Math.min(cw / nw, ch / nh);
  const dw = nw * scale;
  const dh = nh * scale;
  const left = cl + (cw - dw) / 2;
  const top = ct + (ch - dh) / 2;
  return (
    clientX >= left &&
    clientX <= left + dw &&
    clientY >= top &&
    clientY <= top + dh
  );
}

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

const gallerySlotClassName = 'relative min-h-0 overflow-hidden bg-gray-100';

function GalleryImageSlot({
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

function ActivityImageLightbox({
  urls,
  title,
  index,
  onClose,
  onNavigate,
}: {
  urls: string[];
  title: string;
  index: number;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
}) {
  const url = urls[index];
  const total = urls.length;
  const canNavigate = total > 1;
  const imageSlotRef = useRef<HTMLDivElement>(null);

  const handlePanelPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.button !== 0 && event.pointerType === 'mouse') return;

      const t = event.target;
      if (t instanceof Element && t.closest('button')) return;

      const container = imageSlotRef.current;
      const img = container?.querySelector('img');
      if (
        container &&
        img instanceof HTMLImageElement &&
        img.complete &&
        img.naturalWidth > 0
      ) {
        const cr = container.getBoundingClientRect();
        if (
          isPointerOnObjectContainContent(event.clientX, event.clientY, cr, img)
        ) {
          return;
        }
      }

      onClose();
    },
    [onClose]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!canNavigate) return;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onNavigate(index - 1 < 0 ? total - 1 : index - 1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        onNavigate(index + 1 >= total ? 0 : index + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canNavigate, index, onNavigate, total]);

  if (!url) return null;

  const navButtonClass =
    'inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full leading-none text-white transition-colors hover:bg-white/15 active:bg-white/25 md:size-12';

  const navIconClass = 'block h-10 w-10 shrink-0';

  return (
    <ModalOverlay
      onClose={onClose}
      className="px-3 py-6 sm:px-6 md:px-10 md:py-10"
    >
      <div
        className="flex w-full max-w-7xl flex-col lg:max-w-[min(100%,88rem)]"
        onPointerDown={handlePanelPointerDown}
      >
        <div className="mb-2 flex shrink-0 justify-end md:mb-3">
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className={navButtonClass}
          >
            <IcClose aria-hidden className="block size-6 shrink-0" />
          </button>
        </div>

        <div
          className={cn(
            'flex min-h-0 w-full items-center',
            canNavigate && 'gap-4 sm:gap-6 md:gap-8 lg:gap-12'
          )}
        >
          {canNavigate ? (
            <button
              type="button"
              aria-label="이전 이미지"
              onClick={() => onNavigate(index - 1 < 0 ? total - 1 : index - 1)}
              className={navButtonClass}
            >
              <IcArrowNaviLeft aria-hidden className={navIconClass} />
            </button>
          ) : null}

          <div
            ref={imageSlotRef}
            className="relative isolate h-[min(78vh,720px)] min-h-[12rem] min-w-0 flex-1 basis-0 md:min-h-[16rem]"
          >
            <Image
              src={url}
              alt={`${title} 이미지 ${index + 1}`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 1152px"
              priority
            />
          </div>

          {canNavigate ? (
            <button
              type="button"
              aria-label="다음 이미지"
              onClick={() => onNavigate(index + 1 >= total ? 0 : index + 1)}
              className={navButtonClass}
            >
              <IcArrowNaviRight aria-hidden className={navIconClass} />
            </button>
          ) : null}
        </div>

        {canNavigate ? (
          <p className="typo-sm-medium mt-4 text-center text-white/90">
            {index + 1} / {total}
          </p>
        ) : null}
      </div>
    </ModalOverlay>
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
  const lightboxUrls = count > 4 ? imageUrls.slice(0, 4) : [...imageUrls];

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
            sizes="(max-width: 768px) 100vw, 75vw"
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
            sizes="(max-width: 768px) 100vw, 75vw"
            onOpen={() => setLightboxIndex(0)}
          />
          <GalleryImageSlot
            src={imageUrls[1]}
            alt={`${title} 이미지 2`}
            className="min-h-0 flex-1"
            sizes="(max-width: 768px) 100vw, 75vw"
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
            onOpen={() => setLightboxIndex(0)}
          />
          <div className="row-span-2 flex h-full min-h-0 flex-col gap-2">
            <GalleryImageSlot
              src={imageUrls[1]}
              alt={`${title} 추가 이미지 1`}
              className="min-h-0 flex-1"
              onOpen={() => setLightboxIndex(1)}
            />
            <GalleryImageSlot
              src={imageUrls[2]}
              alt={`${title} 추가 이미지 2`}
              className="min-h-0 flex-1"
              onOpen={() => setLightboxIndex(2)}
            />
          </div>
        </div>
        {lightbox}
      </>
    );
  }

  const quad = imageUrls.slice(0, 4);

  return (
    <>
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
            onOpen={() => setLightboxIndex(index)}
          />
        ))}
      </div>
      {lightbox}
    </>
  );
}

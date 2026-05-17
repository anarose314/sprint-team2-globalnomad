'use client';

import type { MouseEvent, PointerEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  IcArrowNaviLeft,
  IcArrowNaviRight,
  IcClose,
} from '@/shared/assets/icons';
import { ModalOverlay } from '@/shared/components/modal/modal-overlay';
import { useRequestModalClose } from '@/shared/components/modal/modal-overlay/modal-overlay-close-context';
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

export interface ActivityImageLightboxProps {
  urls: string[];
  title: string;
  index: number;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
}

export function ActivityImageLightbox({
  urls,
  title,
  index,
  onClose,
  onNavigate,
}: ActivityImageLightboxProps) {
  const overlayClose = useRequestModalClose();

  const requestDismiss = useCallback(() => {
    if (overlayClose) {
      overlayClose.requestClose();
      return;
    }
    onClose();
  }, [overlayClose, onClose]);
  const url = urls[index];
  const total = urls.length;
  const canNavigate = total > 1;
  const imageSlotRef = useRef<HTMLDivElement>(null);
  const prevIndexRef = useRef<number | null>(null);

  const [slideAnim, setSlideAnim] = useState<'from-right' | 'from-left' | null>(
    null
  );

  const handlePanelPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (event.button !== 0 && event.pointerType === 'mouse') return;

      const t = event.target;
      if (t instanceof Element && t.closest('button')) return;
      if (t instanceof Element && t.closest('[data-lightbox-image-slot]')) {
        return;
      }

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

      requestDismiss();
    },
    [requestDismiss]
  );

  const handleImageSlotClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (event.button !== 0) return;
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
          !isPointerOnObjectContainContent(
            event.clientX,
            event.clientY,
            cr,
            img
          )
        ) {
          requestDismiss();
        }
      }
    },
    [requestDismiss]
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

  useEffect(() => {
    if (prevIndexRef.current === null) {
      prevIndexRef.current = index;
      return;
    }
    if (prevIndexRef.current === index) return;
    const dir = index > prevIndexRef.current ? 'from-right' : 'from-left';
    prevIndexRef.current = index;

    let clearAnim: number | undefined;
    const raf = requestAnimationFrame(() => {
      setSlideAnim(dir);
      clearAnim = window.setTimeout(() => setSlideAnim(null), 200);
    });
    return () => {
      cancelAnimationFrame(raf);
      if (clearAnim) window.clearTimeout(clearAnim);
    };
  }, [index]);

  if (!url) return null;

  const navButtonClass =
    'inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full leading-none text-white transition-colors duration-200 ease-out hover:bg-white/15 active:bg-white/25 motion-safe:active:scale-95 md:size-12';

  const navIconClass = 'block h-10 w-10 shrink-0';

  return (
    <ModalOverlay
      onClose={onClose}
      className="px-3 py-6 sm:px-6 md:px-10 md:py-10"
    >
      <div
        className="mx-auto flex w-full max-w-7xl flex-col lg:max-w-screen-2xl"
        onPointerDown={handlePanelPointerDown}
      >
        <div className="mb-2 flex shrink-0 justify-end md:mb-3">
          <button
            type="button"
            aria-label="닫기"
            onClick={requestDismiss}
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
            data-lightbox-image-slot
            className="relative isolate aspect-video max-h-dvh min-h-48 w-full max-w-full min-w-0 flex-1 basis-0 md:min-h-64"
            onClick={handleImageSlotClick}
          >
            <div
              key={url}
              className="relative h-full w-full"
              style={
                slideAnim === 'from-right'
                  ? {
                      animation:
                        'lightbox-enter-from-right 0.18s ease-out both',
                    }
                  : slideAnim === 'from-left'
                    ? {
                        animation:
                          'lightbox-enter-from-left 0.18s ease-out both',
                      }
                    : undefined
              }
            >
              <Image
                src={url}
                alt={`${title} 이미지 ${index + 1}`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 1152px"
                priority
                draggable={false}
              />
            </div>
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

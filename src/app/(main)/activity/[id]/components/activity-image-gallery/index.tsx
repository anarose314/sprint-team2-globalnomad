import Image from 'next/image';
import { cn } from '@/shared/utils/cn';

interface ActivityImageGalleryProps {
  bannerImageUrl?: string;
  subImageUrls?: string[];
  title?: string;
  className?: string;
}

function ImageSlot({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={cn('relative overflow-hidden bg-gray-100', className)}>
      {src ? <Image src={src} alt={alt} fill className="object-cover" /> : null}
    </div>
  );
}

/**
 * 체험 상세 페이지 이미지 갤러리
 *
 * - 배너 이미지(좌, 2/3 폭) + 서브 이미지 2장(우, 1/3 폭 각 1/2 높이)
 * - 이미지 URL이 없으면 회색 플레이스홀더로 대체 (API 연동 전)
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
  const [subImage1, subImage2] = subImageUrls;

  return (
    <div
      className={cn(
        'grid aspect-327/188 grid-cols-2 grid-rows-2 gap-2 overflow-hidden rounded-3xl md:aspect-684/360 2xl:aspect-auto 2xl:h-128',
        className
      )}
    >
      <ImageSlot
        src={bannerImageUrl}
        alt={title}
        className="row-span-2 h-full"
      />
      <div className="row-span-2 flex h-full flex-col gap-2">
        <ImageSlot
          src={subImage1}
          alt={`${title} 추가 이미지 1`}
          className="flex-1"
        />
        <ImageSlot
          src={subImage2}
          alt={`${title} 추가 이미지 2`}
          className="flex-1"
        />
      </div>
    </div>
  );
}

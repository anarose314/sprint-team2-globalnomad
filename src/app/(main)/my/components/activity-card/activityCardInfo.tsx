import { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ActivityCardInfoProps {
  priority?: boolean;
  title: string;
  activityId: number;
  bannerImageUrl: string;
  children: ReactNode;
}

export function ActivityCardInfo({
  priority,
  title,
  activityId,
  bannerImageUrl,
  children,
}: ActivityCardInfoProps) {
  return (
    <Link
      href={`/activity/${activityId}`}
      className="shadow-card group flex min-h-45 justify-between overflow-hidden rounded-3xl"
    >
      {/* 상세 내용 */}
      <div className="flex flex-1 flex-col justify-center gap-1 px-4 py-4">
        {children}
      </div>
      {/* 이미지 */}
      <figure className="relative w-1/3 shrink-0 overflow-hidden md:w-1/4">
        <Image
          fill
          src={bannerImageUrl}
          alt={title}
          priority={priority}
          sizes="(min-width: 768px) 25vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </figure>
    </Link>
  );
}

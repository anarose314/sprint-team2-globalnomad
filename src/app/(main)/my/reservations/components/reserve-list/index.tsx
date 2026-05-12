'use client';

import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { ActivityCard } from '@/app/(main)/my/components/activity-card';
import { MyPageEmpty } from '@/app/(main)/my/components/my-page-empty';
import { ReserveButtons } from '@/app/(main)/my/reservations/components/reserve-buttons';
import { useMyReservations } from '@/app/(main)/my/reservations/hooks/useMyReservations';
import { Heading } from '@/shared/components/heading';
import { Spinner } from '@/shared/components/spinner';
import { StatusBadge } from '@/shared/components/status-badge';

export function ReserveList() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMyReservations(status);

  const { ref } = useInView({
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  const reserveList =
    data?.pages.flatMap((page) => page?.reservations ?? []) ?? [];

  return (
    <>
      {reserveList.length === 0 ? (
        <MyPageEmpty
          message="아직 예약한 체험이 없어요"
          buttonLabel="둘러보기"
          href="/"
        />
      ) : (
        <ul className="flex flex-col gap-5 wrap-anywhere">
          {reserveList.map((reservation) => (
            <li key={reservation.id}>
              <article className="flex flex-col gap-3 border-b border-b-gray-50 pb-7.5">
                {/* 날짜 */}
                <time
                  dateTime={reservation.date}
                  className="typo-lg-bold 2xl:typo-2lg-bold block"
                >
                  {reservation.date}
                </time>
                {/* 카드 */}
                <ActivityCard href={`/activity/${reservation.activity.id}`}>
                  <div className="flex flex-1 flex-col justify-center gap-2 px-4 py-4">
                    <StatusBadge status={reservation.status} />
                    <div>
                      <Heading
                        as="h3"
                        className="typo-md-bold 2xl:typo-2lg-bold"
                      >
                        {reservation.activity.title}
                      </Heading>
                      <p className="typo-sm-medium 2xl:typo-lg-medium text-gray-500">
                        <time dateTime={reservation.startTime}>
                          {reservation.startTime}
                        </time>{' '}
                        -{' '}
                        <time dateTime={reservation.endTime}>
                          {reservation.endTime}
                        </time>
                      </p>
                    </div>
                    <p className="typo-lg-bold 2xl:typo-2lg-bold flex items-center gap-1 text-gray-950">
                      ₩{reservation.totalPrice.toLocaleString('ko-KR')}
                      <span className="typo-md-medium 2xl:typo-lg-medium text-gray-400">
                        {reservation.headCount}명
                      </span>
                    </p>
                  </div>
                  <figure className="relative w-1/3 shrink-0 overflow-hidden md:w-1/4">
                    <Image
                      fill
                      src={reservation.activity.bannerImageUrl}
                      alt={reservation.activity.title}
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </figure>
                </ActivityCard>
                {/* 버튼 */}
                <ReserveButtons status={reservation.status} />
              </article>
            </li>
          ))}
        </ul>
      )}
      <div ref={ref} className="flex h-20 items-center justify-center">
        {isFetchingNextPage && <Spinner />}
      </div>
    </>
  );
}

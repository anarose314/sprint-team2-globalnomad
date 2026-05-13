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
          {reserveList.map((reservation, index) => {
            const {
              id,
              activity,
              status,
              totalPrice,
              headCount,
              date,
              startTime,
              endTime,
              reviewSubmitted,
            } = reservation;

            const reservationInfo = {
              id,
              status,
              title: activity.title,
              description: `${date} / ${startTime} - ${endTime} (${headCount}명)`,
              reviewSubmitted,
            };

            return (
              <li key={id}>
                <article className="flex flex-col gap-3 border-b border-b-gray-50 pb-7.5">
                  {/* 카드 영역 */}
                  <ActivityCard href={`/activity/${activity.id}`}>
                    <div className="flex flex-1 flex-col justify-center gap-2 px-4 py-4">
                      {/* 뱃지 */}
                      <StatusBadge status={status} />
                      <div>
                        {/* 제목 */}
                        <Heading
                          as="h3"
                          className="typo-md-bold 2xl:typo-2lg-bold"
                        >
                          {activity.title}
                        </Heading>
                        {/* 날짜 · 시간 */}
                        <div className="typo-sm-medium 2xl:typo-lg-medium flex gap-2 text-gray-500">
                          {/* 날짜 */}
                          <span>
                            <time dateTime={date}>{date}</time>
                          </span>
                          {/* 구분자 */}
                          <span aria-hidden="true">·</span>
                          {/* 시간 */}
                          <span>
                            <time dateTime={startTime}>{startTime}</time> -{' '}
                            <time dateTime={endTime}>{endTime}</time>
                          </span>
                        </div>
                      </div>
                      {/* 가격 및 인원 */}
                      <p className="typo-lg-bold 2xl:typo-2lg-bold flex items-center gap-1 text-gray-950">
                        ₩{totalPrice.toLocaleString('ko-KR')}
                        <span className="typo-md-medium 2xl:typo-lg-medium text-gray-400">
                          {headCount}명
                        </span>
                      </p>
                    </div>
                    {/* 이미지 영역 */}
                    <figure className="relative w-1/3 shrink-0 overflow-hidden md:w-1/4">
                      <Image
                        fill
                        src={activity.bannerImageUrl}
                        alt={activity.title}
                        priority={index === 0}
                        sizes="(min-width: 768px) 25vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </figure>
                  </ActivityCard>
                  {/* 하단 버튼 영역 */}
                  <ReserveButtons reservationInfo={reservationInfo} />
                </article>
              </li>
            );
          })}
        </ul>
      )}
      <div ref={ref} className="flex h-20 items-center justify-center">
        {isFetchingNextPage && <Spinner />}
      </div>
    </>
  );
}

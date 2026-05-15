'use client';

import { useInView } from 'react-intersection-observer';
import { useSearchParams } from 'next/navigation';
import { MyActivityCard } from '@/app/(main)/my/components/my-activity-card';
import { MyPageEmpty } from '@/app/(main)/my/components/my-page-empty';
import { ReserveButtons } from '@/app/(main)/my/reservations/components/reserve-buttons';
import { useMyReservations } from '@/app/(main)/my/reservations/hooks/useMyReservations';
import { Spinner } from '@/shared/components/spinner';

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
        <ul className="flex flex-col gap-7.5 wrap-anywhere">
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
              <MyActivityCard key={id}>
                <MyActivityCard.Info
                  priority={index === 0}
                  title={activity.title}
                  activityId={activity.id}
                  bannerImageUrl={activity.bannerImageUrl}
                >
                  <MyActivityCard.Status status={status} />
                  <MyActivityCard.Heading title={activity.title} />
                  <MyActivityCard.DateTime
                    date={date}
                    startTime={startTime}
                    endTime={endTime}
                  />
                  <MyActivityCard.Price
                    price={totalPrice}
                    headCount={headCount}
                  />
                </MyActivityCard.Info>
                <MyActivityCard.Buttons>
                  <ReserveButtons reservationInfo={reservationInfo} />
                </MyActivityCard.Buttons>
              </MyActivityCard>
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

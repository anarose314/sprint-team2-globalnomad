import Image from 'next/image';
import { ActivityCard } from '@/app/(main)/my/components/activity-card';
import { ReserveButtons } from '@/app/(main)/my/reservations/components/reserve-buttons';
import { DUMMY_RESERVATION_LIST } from '@/app/(main)/my/reservations/components/reserve-list/reserveList.constants';
import { Heading } from '@/shared/components/heading';
import { StatusBadge } from '@/shared/components/status-badge';

export function ReserveList() {
  // TODO: API 데이터 연동
  const reserveList = DUMMY_RESERVATION_LIST.reservations;

  return (
    <section className="mt-7.5">
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
              {/* TODO: API 데이터 연동하면 해당 체험 url 넣기 */}
              <ActivityCard href="/">
                <div className="flex flex-1 flex-col justify-center gap-2 px-4 py-4">
                  <StatusBadge status={reservation.status} />
                  <div>
                    <Heading as="h3" className="typo-md-bold 2xl:typo-2lg-bold">
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
    </section>
  );
}

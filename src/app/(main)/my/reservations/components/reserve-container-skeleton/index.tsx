import { ReserveFilterSkeleton } from '@/app/(main)/my/reservations/components/reserve-filter-skeleton';
import { ReserveListSkeleton } from '@/app/(main)/my/reservations/components/reserve-list-skeleton';

export function ReserveContainerSkeleton() {
  return (
    <>
      {/* 1. 필터 스켈레톤 */}
      <ReserveFilterSkeleton />

      {/* 2. 리스트 스켈레톤 */}
      <section className="mt-7.5">
        <ReserveListSkeleton />
      </section>
    </>
  );
}

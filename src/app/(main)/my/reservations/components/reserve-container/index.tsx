import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { ReserveContainerProps } from '@/app/(main)/my/reservations/components/reserve-container/reserveContainer.types';
import { ReserveFilter } from '@/app/(main)/my/reservations/components/reserve-filter';
import { ReserveList } from '@/app/(main)/my/reservations/components/reserve-list';
import { myReservationsOptions } from '@/app/(main)/my/reservations/hooks/useMyReservations';
import { MY_RESERVATIONS_SIZE } from '@/app/(main)/my/reservations/reservations.constants';
import { fetchInstanceServer } from '@/shared/apis/fetchInstance.server';
import { MyReservationsResponse } from '@/shared/types/myReservation.types';

export async function ReserveContainer({
  searchParams,
}: ReserveContainerProps) {
  const queryClient = new QueryClient();
  const status = searchParams?.status || null;

  const params = new URLSearchParams({ size: String(MY_RESERVATIONS_SIZE) });
  if (status) {
    params.set('status', status);
  }

  await queryClient.prefetchInfiniteQuery({
    ...myReservationsOptions(status),
    queryFn: () =>
      fetchInstanceServer<MyReservationsResponse>(
        `/my-reservations?${params.toString()}`
      ),
  });

  return (
    <>
      <ReserveFilter />
      <section className="mt-7.5">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ReserveList />
        </HydrationBoundary>
      </section>
    </>
  );
}

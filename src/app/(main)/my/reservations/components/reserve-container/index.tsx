import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { ReserveFilter } from '@/app/(main)/my/reservations/components/reserve-filter';
import { ReserveList } from '@/app/(main)/my/reservations/components/reserve-list';
import { myReservationsOptions } from '@/app/(main)/my/reservations/hooks/useMyReservations';
import { MY_RESERVATIONS_SIZE } from '@/app/(main)/my/reservations/reservations.constants';
import { fetchInstanceServer } from '@/shared/apis/fetchInstance.server';
import { MyReservationsResponse } from '@/shared/types/myReservation.types';

export async function ReserveContainer() {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    ...myReservationsOptions(),
    queryFn: () =>
      fetchInstanceServer<MyReservationsResponse>(
        `/my-reservations?size=${MY_RESERVATIONS_SIZE}`
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

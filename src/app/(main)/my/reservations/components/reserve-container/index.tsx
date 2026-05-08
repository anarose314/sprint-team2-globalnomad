import { ReserveFilter } from '@/app/(main)/my/reservations/components/reserve-filter';
import { ReserveList } from '@/app/(main)/my/reservations/components/reserve-list';
import { MY_RESERVATIONS_SIZE } from '@/app/(main)/my/reservations/reservations.constants';
import { fetchInstanceServer } from '@/shared/apis/fetchInstance.server';
import { MyReservationsResponse } from '@/shared/types/myReservation.types';

export async function ReserveContainer() {
  const data = await fetchInstanceServer<MyReservationsResponse>(
    `/my-activities?size=${MY_RESERVATIONS_SIZE}`
  );

  return (
    <>
      <ReserveFilter />
      <section className="mt-7.5">
        <ReserveList initialData={data} />
      </section>
    </>
  );
}

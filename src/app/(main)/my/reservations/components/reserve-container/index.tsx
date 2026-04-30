import { ReserveFilter } from '@/app/(main)/my/reservations/components/reserve-filter';
import { ReserveList } from '@/app/(main)/my/reservations/components/reserve-list';

export function ReserveContainer() {
  return (
    <>
      <ReserveFilter />
      <ReserveList />
    </>
  );
}

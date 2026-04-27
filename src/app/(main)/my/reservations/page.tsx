import { Metadata } from 'next';
import { MyPageHeader } from '@/app/(main)/my/components/my-page-header';
import { ReserveContainer } from '@/app/(main)/my/reservations/components/reserve-container';

export const metadata: Metadata = {
  title: '예약 내역',
};

export default function MyReservationsPage() {
  return (
    <>
      <MyPageHeader
        title="예약 내역"
        description="예약 내역 변경 및 취소할 수 있습니다."
      />
      <ReserveContainer />
    </>
  );
}

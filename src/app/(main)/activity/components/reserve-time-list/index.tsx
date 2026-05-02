'use client';

import { ReserveTime } from '@/app/(main)/activity/components/reserve-time';

export function ReserveTimeList() {
  const handleAdd = () => {
    console.log('더하기 이벤트');
  };

  const handleDelete = () => {
    console.log('빼기 이벤트');
  };

  return (
    <div className="flex flex-col gap-5">
      <ReserveTime
        onClick={handleAdd}
        hasLabel
        isAddAction
        className="border-b border-gray-100 pb-5"
      />
      <ReserveTime onClick={handleDelete} />
      <ReserveTime onClick={handleDelete} />
    </div>
  );
}

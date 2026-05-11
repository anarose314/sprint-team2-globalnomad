'use client';

import { useState } from 'react';
import { ReserveTime } from '@/app/(main)/activity/components/reserve-time';
import { Schedule } from '@/app/(main)/activity/components/reserve-time/reserveTime.types';
import { validateSchedule } from '@/app/(main)/activity/components/reserve-time-list/validateSchedule';
import { useShowToast } from '@/shared/store/useToastStore';
import { generateId } from '@/shared/utils/generateId';

const INITIAL_SCHEDULE: Schedule = {
  id: '',
  date: '',
  startTime: '',
  endTime: '',
};

/**
 * 예약 가능한 시간대 목록을 렌더링하고 추가, 수정, 삭제를 관리하는 컴포넌트
 */
export function ReserveTimeList() {
  const [inputSchedule, setInputSchedule] =
    useState<Schedule>(INITIAL_SCHEDULE);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const showToast = useShowToast();

  const handleAdd = () => {
    const { isValid, errorMessage } = validateSchedule(
      inputSchedule,
      schedules
    );

    if (!isValid) {
      showToast({ theme: 'error', message: errorMessage! });
      return;
    }

    const newSchedule = {
      ...inputSchedule,
      id: generateId(),
    };

    setSchedules((prev) => [...prev, newSchedule]);
    setInputSchedule(INITIAL_SCHEDULE);
  };

  const handleDelete = (id: string) => {
    setSchedules((prev) => prev.filter((schedule) => schedule.id !== id));
  };

  const handleUpdate = (id: string, updatedSchedule: Schedule) => {
    const { isValid, errorMessage } = validateSchedule(
      updatedSchedule,
      schedules,
      id
    );

    if (!isValid) {
      showToast({ theme: 'error', message: errorMessage! });
      return;
    }

    setSchedules((prev) =>
      prev.map((schedule) => (schedule.id === id ? updatedSchedule : schedule))
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <input type="hidden" name="schedules" value={JSON.stringify(schedules)} />

      <ReserveTime
        value={inputSchedule}
        onChange={(newVal) => setInputSchedule(newVal)}
        onClick={handleAdd}
        hasLabel
        isAddAction
        className="border-b border-gray-100 pb-5"
      />
      {schedules.map((item) => (
        <ReserveTime
          key={item.id}
          value={item}
          onChange={(newVal) => handleUpdate(item.id, newVal)}
          onClick={() => handleDelete(item.id)}
        />
      ))}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { ReserveTime } from '@/app/(main)/activity/components/reserve-time';
import { Schedule } from '@/app/(main)/activity/components/reserve-time/reserveTime.types';
import { generateId } from '@/shared/utils/generateId';

const INITIAL_SCHEDULE: Schedule = {
  id: '',
  date: '',
  startTime: '',
  endTime: '',
};

export function ReserveTimeList() {
  const [inputSchedule, setInputSchedule] =
    useState<Schedule>(INITIAL_SCHEDULE);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const handleAdd = () => {
    // TODO: 유효성 검사 추가 (실행 시 시간이 비어 있음 or 시작 시간이 종료 시간보다 느림)
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

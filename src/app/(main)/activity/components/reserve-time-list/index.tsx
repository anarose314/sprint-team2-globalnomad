'use client';

import { useState } from 'react';
import { ReserveTime } from '@/app/(main)/activity/components/reserve-time';
import { Schedule } from '@/app/(main)/activity/components/reserve-time/reserveTime.types';
import { generateId } from '@/shared/utils/generateId';

export function ReserveTimeList() {
  const [inputSchedule, setInputSchedule] = useState({
    date: '',
    startTime: '',
    endTime: '',
  });
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const handleAdd = () => {
    // TODO: 유효성 검사 추가 (실행 시 시간이 비어 있음 or 시작 시간이 종료 시간보다 느림)
    const newSchedule = {
      id: generateId(),
      ...inputSchedule,
    };
    setSchedules((prev) => [...prev, newSchedule]);
    setInputSchedule({ date: '', startTime: '', endTime: '' });
  };

  const handleDelete = (index: number) => {
    setSchedules((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdate = (index: number, updatedSchedule: Schedule) => {
    setSchedules((prev) =>
      prev.map((item, i) => (i === index ? updatedSchedule : item))
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <ReserveTime
        value={inputSchedule}
        onChange={(newVal) => setInputSchedule(newVal)}
        onClick={handleAdd}
        hasLabel
        isAddAction
        className="border-b border-gray-100 pb-5"
      />
      {schedules.map((item, index) => (
        <ReserveTime
          key={item.id}
          value={item}
          onChange={(newVal) => handleUpdate(index, newVal)}
          onClick={() => handleDelete(index)}
        />
      ))}
    </div>
  );
}

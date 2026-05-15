'use client';

import { useState } from 'react';
import { ReserveTime } from '@/app/(main)/activity/components/reserve-time';
import { Schedule } from '@/app/(main)/activity/components/reserve-time/reserveTime.types';
import { validateSchedule } from '@/app/(main)/activity/components/reserve-time-list/validateSchedule';
import { INPUT_ERROR_MESSAGE_STYLE } from '@/shared/components/input/input.constants';
import { useShowToast } from '@/shared/store/useToastStore';
import { cn } from '@/shared/utils/cn';
import { generateId } from '@/shared/utils/generateId';

const INITIAL_SCHEDULE: Schedule = {
  id: '',
  date: '',
  startTime: '',
  endTime: '',
};

export interface ReserveTimeListProps {
  schedules: Schedule[];
  onSchedulesChange: (schedules: Schedule[]) => void;
  errorMessage?: string;
  clearError?: () => void;
}

/**
 * 예약 가능한 시간대 목록을 렌더링하고 추가, 수정, 삭제를 관리하는 컴포넌트
 */
export function ReserveTimeList({
  schedules,
  onSchedulesChange,
  errorMessage,
  clearError,
}: ReserveTimeListProps) {
  const [inputSchedule, setInputSchedule] =
    useState<Schedule>(INITIAL_SCHEDULE);

  const showToast = useShowToast();

  const handleInputChange = (newVal: Schedule) => {
    setInputSchedule(newVal);
    if (errorMessage && clearError) {
      clearError();
    }
  };

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

    onSchedulesChange([...schedules, newSchedule]);
    setInputSchedule(INITIAL_SCHEDULE);
  };

  const handleDelete = (id?: string) => {
    if (!id) return;
    onSchedulesChange(schedules.filter((schedule) => schedule.id !== id));
  };

  const handleUpdate = (id: string | undefined, updatedSchedule: Schedule) => {
    if (!id) return;
    const { isValid, errorMessage } = validateSchedule(
      updatedSchedule,
      schedules,
      id
    );

    if (!isValid) {
      showToast({ theme: 'error', message: errorMessage! });
      return;
    }

    onSchedulesChange(
      schedules.map((schedule) =>
        schedule.id === id ? updatedSchedule : schedule
      )
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <ReserveTime
        value={inputSchedule}
        onChange={handleInputChange}
        onClick={handleAdd}
        hasLabel
        isAddAction
        className="border-b border-gray-100 pb-5"
        isError={Boolean(errorMessage)}
      />
      {schedules.map((item) => (
        <ReserveTime
          key={item.id}
          value={item}
          onChange={(newVal) => handleUpdate(item.id, newVal)}
          onClick={() => handleDelete(item.id)}
        />
      ))}
      {errorMessage && (
        <p className={cn(INPUT_ERROR_MESSAGE_STYLE, 'mt-0')}>{errorMessage}</p>
      )}
    </div>
  );
}

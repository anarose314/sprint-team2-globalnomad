'use client';

import { useMemo, useState } from 'react';
import { ReserveTime } from '@/app/(main)/activity/components/reserve-time';
import { Schedule } from '@/app/(main)/activity/components/reserve-time/reserveTime.types';
import { validateSchedule } from '@/app/(main)/activity/components/reserve-time-list/validateSchedule';
import { IcCalendarSimple, IcClose, IcTrash } from '@/shared/assets/icons';
import { INPUT_ERROR_MESSAGE_STYLE } from '@/shared/components/input/input.constants';
import { useShowToast } from '@/shared/store/useToastStore';
import { cn } from '@/shared/utils/cn';
import { formatDateKorean } from '@/shared/utils/formatDate';
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

/** 날짜별로 schedules를 그룹핑 */
function groupByDate(schedules: Schedule[]): Record<string, Schedule[]> {
  const sortedSchedules = [...schedules].sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  );
  return sortedSchedules.reduce<Record<string, Schedule[]>>((acc, schedule) => {
    const key = schedule.date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(schedule);
    return acc;
  }, {});
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
  };

  /** 개별 시간대 삭제 */
  const handleDeleteOne = (id: string) => {
    onSchedulesChange(schedules.filter((s) => s.id !== id));
  };

  /** 날짜 그룹 전체 삭제 */
  const handleDeleteGroup = (date: string) => {
    onSchedulesChange(schedules.filter((s) => s.date !== date));
  };

  const grouped = useMemo(() => groupByDate(schedules), [schedules]);
  const sortedDates = useMemo(() => Object.keys(grouped).sort(), [grouped]);

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

      {/* 날짜별 그룹 목록 */}
      {sortedDates.map((date) => (
        <div
          key={date}
          className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-3 rounded-2xl border border-gray-100 px-4 py-4"
        >
          {/* 날짜 */}
          <div className="flex items-center gap-2 text-gray-900">
            <IcCalendarSimple className="h-5 w-5" />
            <p className="typo-md-semibold">{formatDateKorean(date)}</p>
          </div>

          {/* 삭제 버튼 */}
          <button
            type="button"
            onClick={() => handleDeleteGroup(date)}
            className="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center self-start"
            aria-label="날짜 전체 삭제"
          >
            <IcTrash className="h-full w-full text-red-500 hover:text-red-700" />
          </button>

          {/* 시간 태그들 */}
          <div className="col-span-2 flex flex-wrap gap-2">
            {grouped[date].map((schedule) => (
              <span
                key={schedule.id}
                className="typo-sm-medium flex h-6 items-center gap-1 rounded-full bg-gray-50 px-3 whitespace-nowrap text-gray-700"
              >
                {schedule.startTime} ~ {schedule.endTime}
                <button
                  type="button"
                  onClick={() => handleDeleteOne(schedule.id!)}
                  className="cursor-pointer"
                  aria-label="시간대 삭제"
                >
                  <IcClose className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              </span>
            ))}
          </div>
        </div>
      ))}

      {errorMessage && (
        <p className={cn(INPUT_ERROR_MESSAGE_STYLE, 'mt-0')}>{errorMessage}</p>
      )}
    </div>
  );
}

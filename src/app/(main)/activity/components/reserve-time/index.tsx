'use client';

import { useEffect, useRef, useState } from 'react';
import Calendar from 'react-calendar';
import { Value } from 'react-calendar/dist/shared/types.js';
import { ReserveTimeProps } from '@/app/(main)/activity/components/reserve-time/reserveTime.types';
import { ReserveTimeDropdown } from '@/app/(main)/activity/components/reserve-time-dropdown';
import { IcCalendar, IcMinus, IcPlus } from '@/shared/assets/icons';
import { BUTTON_VARIANTS } from '@/shared/components/buttons/button/button.constants';
import { Input } from '@/shared/components/input';
import { cn } from '@/shared/utils/cn';
import { formatDateKey } from '@/shared/utils/formatDate';
import 'react-calendar/dist/Calendar.css';

export function ReserveTime({
  value,
  onChange,
  onClick,
  hasLabel = false,
  isAddAction = false,
  className,
}: ReserveTimeProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarContainerRef = useRef<HTMLDivElement>(null);

  const handleChange = (key: keyof typeof value, val: string) => {
    onChange({ ...value, [key]: val });
  };

  const handleCalendarOpen = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  const handleCalendarClick = (val: Value) => {
    if (val instanceof Date) {
      handleChange('date', formatDateKey(val));
      setIsCalendarOpen(false);
    }
  };

  useEffect(() => {
    if (!isCalendarOpen) return;
    const handleClickOutside = (event: PointerEvent) => {
      if (!calendarContainerRef.current) return;
      if (!calendarContainerRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener('pointerdown', handleClickOutside);

    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, [isCalendarOpen]);

  return (
    <div
      className={cn(
        'flex w-full flex-wrap items-end gap-3.5 md:flex-nowrap',
        className
      )}
    >
      {/* 날짜 */}
      <div
        className="relative w-full md:w-auto md:flex-4"
        ref={calendarContainerRef}
      >
        <Input
          label={hasLabel ? '날짜' : undefined}
          placeholder="날짜를 선택해 주세요"
          value={value.date}
          onClick={handleCalendarOpen}
          onKeyDown={(e) => e.key === 'Enter' && handleCalendarOpen()}
          rightIcon={<IcCalendar className="text-black" />}
          rightIconClassName="pointer-events-none"
          className="cursor-pointer"
          required
          readOnly
        />
        {isCalendarOpen && (
          <div className="bg-primary-50 z-base absolute mt-2">
            <Calendar
              locale="ko-KR"
              calendarType="gregory"
              className="form-calendar"
              onChange={handleCalendarClick}
            />
          </div>
        )}
      </div>
      {/* 시간 */}
      <div className="flex flex-1 flex-wrap items-end gap-2.25 md:flex-3 md:flex-nowrap">
        <div className="flex-1 md:w-31">
          <ReserveTimeDropdown
            label={hasLabel ? '시작 시간' : undefined}
            value={value.startTime}
            onChange={(val) => handleChange('startTime', val)}
          />
        </div>
        <span className="relative bottom-3.5 shrink-0">-</span>
        <div className="flex-1 md:w-31">
          <ReserveTimeDropdown
            label={hasLabel ? '종료 시간' : undefined}
            value={value.endTime}
            onChange={(val) => handleChange('endTime', val)}
          />
        </div>
        {/* 버튼 */}
        <button
          type="button"
          className={cn(
            BUTTON_VARIANTS({ variant: isAddAction ? 'primary' : 'secondary' }),
            'relative h-10.5 shrink-0 p-0!',
            !isAddAction && 'bg-gray-25',
            'bottom-0 w-full rounded-xl',
            'xs:w-10.5 xs:rounded-full xs:bottom-1.5'
          )}
          onClick={onClick}
        >
          {isAddAction ? (
            <IcPlus className="xs:w-1/3 w-5 text-white" />
          ) : (
            <IcMinus className="xs:w-1/3 w-5 text-gray-600" />
          )}
        </button>
      </div>
    </div>
  );
}

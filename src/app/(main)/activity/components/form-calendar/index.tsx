'use client';

import { useEffect, useRef, useState } from 'react';
import Calendar from 'react-calendar';
import {
  FormCalendarProps,
  Value,
} from '@/app/(main)/activity/components/form-calendar/formCalendar.types';
import { IcArrowLeft, IcArrowRight, IcCalendar } from '@/shared/assets/icons';
import { Input } from '@/shared/components/input';
import { WEEKDAY } from '@/shared/constants/calendar.constants';
import { formatDateKey } from '@/shared/utils/formatDate';
import '@/app/(main)/activity/components/form-calendar/form-calendar.css';

const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

export function FormCalendar({ onChange, hasLabel, date }: FormCalendarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [today, setToday] = useState(getToday);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    if (!isOpen) {
      const currentToday = getToday();
      if (currentToday.getTime() !== today.getTime()) {
        setToday(currentToday);
      }
    }
    setIsOpen(!isOpen);
  };

  const handleClick = (val: Value) => {
    if (val instanceof Date) {
      onChange('date', formatDateKey(val));
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: PointerEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative w-full md:w-auto md:flex-4" ref={containerRef}>
      <Input
        label={hasLabel ? '날짜' : undefined}
        placeholder="날짜를 선택해 주세요"
        value={date}
        onClick={handleOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOpen();
          }
        }}
        rightIcon={<IcCalendar className="text-black" />}
        rightIconClassName="pointer-events-none"
        className="cursor-pointer"
        required
        readOnly
        aria-haspopup="grid"
        aria-expanded={isOpen}
      />
      {isOpen && (
        <div className="z-dropdown absolute mt-2">
          <Calendar
            locale="ko-KR"
            calendarType="gregory"
            className="form-calendar"
            onChange={handleClick}
            value={date ? new Date(date + 'T00:00:00') : null}
            prev2Label={null}
            next2Label={null}
            prevLabel={
              <span className="inline-flex h-6 w-6 items-center justify-center text-gray-950">
                <IcArrowLeft className="h-4 w-4" />
              </span>
            }
            nextLabel={
              <span className="inline-flex h-6 w-6 items-center justify-center text-gray-950">
                <IcArrowRight className="h-4 w-4" />
              </span>
            }
            formatShortWeekday={(_, date) => WEEKDAY[date.getDay()]}
            formatDay={(_, date) => date.getDate().toString()}
            minDate={today}
          />
        </div>
      )}
    </div>
  );
}

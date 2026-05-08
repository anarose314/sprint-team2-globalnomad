import { useEffect, useRef, useState } from 'react';
import Calendar from 'react-calendar';
import { Value } from 'react-calendar/dist/shared/types.js';
import { FormCalendarProps } from '@/app/(main)/activity/components/form-calendar/formCalendar.types';
import { IcCalendar } from '@/shared/assets/icons';
import { Input } from '@/shared/components/input';
import { formatDateKey } from '@/shared/utils/formatDate';

export function FormCalendar({ onChange, hasLabel, date }: FormCalendarProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarContainerRef = useRef<HTMLDivElement>(null);

  const handleCalendarOpen = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  const handleCalendarClick = (val: Value) => {
    if (val instanceof Date) {
      onChange('date', formatDateKey(val));
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
      className="relative w-full md:w-auto md:flex-4"
      ref={calendarContainerRef}
    >
      <Input
        label={hasLabel ? '날짜' : undefined}
        placeholder="날짜를 선택해 주세요"
        value={date}
        onClick={handleCalendarOpen}
        onKeyDown={(e) => e.key === 'Enter' && handleCalendarOpen()}
        rightIcon={<IcCalendar className="text-black" />}
        rightIconClassName="pointer-events-none"
        className="cursor-pointer"
        required
        readOnly
      />
      {isCalendarOpen && (
        <div className="z-base absolute mt-2">
          <Calendar
            locale="ko-KR"
            calendarType="gregory"
            className="form-calendar"
            onChange={handleCalendarClick}
          />
        </div>
      )}
    </div>
  );
}

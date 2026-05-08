import { useEffect, useRef, useState } from 'react';
import Calendar from 'react-calendar';
import {
  CalendarValue,
  FormCalendarProps,
} from '@/app/(main)/activity/components/form-calendar/formCalendar.types';
import { WEEKDAY } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservationCalendar.constants';
import { IcArrowLeft, IcArrowRight, IcCalendar } from '@/shared/assets/icons';
import { Input } from '@/shared/components/input';
import { formatDateKey } from '@/shared/utils/formatDate';
import '@/app/(main)/activity/components/form-calendar/form-calendar.css';

export function FormCalendar({ onChange, hasLabel, date }: FormCalendarProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarContainerRef = useRef<HTMLDivElement>(null);

  const handleCalendarOpen = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  const handleCalendarClick = (val: CalendarValue) => {
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
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCalendarOpen();
          }
        }}
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
          />
        </div>
      )}
    </div>
  );
}

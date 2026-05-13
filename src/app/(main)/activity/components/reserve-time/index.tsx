'use client';

import { FormCalendar } from '@/app/(main)/activity/components/form-calendar';
import { ReserveTimeProps } from '@/app/(main)/activity/components/reserve-time/reserveTime.types';
import { ReserveTimeDropdown } from '@/app/(main)/activity/components/reserve-time-dropdown';
import { IcMinus, IcPlus } from '@/shared/assets/icons';
import { BUTTON_VARIANTS } from '@/shared/components/buttons/button/button.constants';
import { cn } from '@/shared/utils/cn';

export function ReserveTime({
  value,
  onChange,
  onClick,
  hasLabel = false,
  isAddAction = false,
  className,
  isError = false,
}: ReserveTimeProps) {
  const handleChange = (key: keyof typeof value, val: string) => {
    onChange({ ...value, [key]: val });
  };

  return (
    <div
      className={cn(
        'flex w-full flex-wrap items-end gap-3.5 md:flex-nowrap',
        className
      )}
    >
      {/* 날짜 */}
      <FormCalendar
        onChange={handleChange}
        hasLabel={hasLabel}
        date={value.date}
        isError={isError}
      />
      {/* 시간 */}
      <div className="flex flex-1 flex-wrap items-end gap-2.25 md:flex-3 md:flex-nowrap">
        <div className="flex-1 md:w-31">
          <ReserveTimeDropdown
            label={hasLabel ? '시작 시간' : undefined}
            value={value.startTime}
            onChange={(val) => handleChange('startTime', val)}
            isError={isError}
          />
        </div>
        <span className="relative bottom-3.5 shrink-0">-</span>
        <div className="flex-1 md:w-31">
          <ReserveTimeDropdown
            label={hasLabel ? '종료 시간' : undefined}
            value={value.endTime}
            onChange={(val) => handleChange('endTime', val)}
            isError={isError}
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

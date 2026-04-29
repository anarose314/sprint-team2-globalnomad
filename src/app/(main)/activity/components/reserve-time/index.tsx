import { ReserveTimeProps } from '@/app/(main)/activity/components/reserve-time/rserveTime.types';
import { IcCalendar, IcMinus, IcPlus } from '@/shared/assets/icons';
import { BUTTON_VARIANTS } from '@/shared/components/buttons/button/button.constants';
import { Input } from '@/shared/components/input';
import { cn } from '@/shared/utils/cn';

export function ReserveTime({
  onClick,
  hasLabel = false,
  isAddAction = false,
  className,
}: ReserveTimeProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-wrap items-end gap-3.5 md:flex-nowrap',
        className
      )}
    >
      {/* 날짜 */}
      <div className="w-full md:w-auto md:flex-4">
        {/* TODO: 달력 연동 */}
        <Input
          label={hasLabel ? '날짜' : undefined}
          placeholder="날짜를 선택해 주세요"
          rightIcon={<IcCalendar className="text-black" />}
        />
      </div>
      {/* 시간 */}
      <div className="flex flex-1 items-end gap-2.25 md:flex-3">
        <div className="flex-1">
          {/* TODO: 드롭다운 메뉴로 변경 */}
          <Input
            label={hasLabel ? '시작 시간' : undefined}
            placeholder="0:00"
          />
        </div>
        <span className="relative bottom-3.5 shrink-0">-</span>
        <div className="flex-1">
          {/* TODO: 드롭다운 메뉴로 변경 */}
          <Input
            label={hasLabel ? '종료 시간' : undefined}
            placeholder="0:00"
          />
        </div>
      </div>
      {/* 버튼 */}
      <button
        type="button"
        className={cn(
          BUTTON_VARIANTS({ variant: isAddAction ? 'primary' : 'secondary' }),
          'relative bottom-1.5 h-10.5 w-10.5 shrink-0 rounded-full p-0!',
          !isAddAction && 'bg-gray-25'
        )}
        onClick={onClick}
      >
        {isAddAction ? (
          <IcPlus className="w-1/3 text-white" />
        ) : (
          <IcMinus className="w-1/3 text-gray-600" />
        )}
      </button>
    </div>
  );
}

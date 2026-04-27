import { FilterButton } from '@/shared/components/buttons';
import { STATUS_TEXT } from '@/shared/constants/status.constants';

const FILTER_ORDER = [
  STATUS_TEXT.approved,
  STATUS_TEXT.cancelled,
  STATUS_TEXT.completed,
  STATUS_TEXT.rejected,
  STATUS_TEXT.attended,
];

export function ReserveFilter() {
  return (
    <div className="relative -mx-6 mt-3.5">
      <ul className="scrollbar-hide flex gap-2 overflow-x-auto px-6 [&>li]:shrink-0">
        {FILTER_ORDER.map((label) => (
          <li key={label}>
            <FilterButton label={label} showIcon={false} className="h-10" />
          </li>
        ))}
      </ul>
    </div>
  );
}

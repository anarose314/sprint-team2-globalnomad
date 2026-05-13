import { Skeleton } from '@/shared/components/skeleton';

export function ReserveFilterSkeleton() {
  return (
    <div className="relative -mx-6 mt-3.5">
      <ul className="scrollbar-hide flex gap-2 overflow-x-auto px-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <li key={i} className="shrink-0">
            <Skeleton width={80} height={40} rounded="full" variant="pulse" />
          </li>
        ))}
      </ul>
    </div>
  );
}

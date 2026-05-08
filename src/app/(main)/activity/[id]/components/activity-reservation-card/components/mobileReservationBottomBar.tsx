import { Button } from '@/shared/components/buttons/button';

interface MobileReservationBottomBarProps {
  onOpenDateSheet: () => void;
}

/**
 * @description 모바일/태블릿 하단 고정 예약 바
 */
export function MobileReservationBottomBar({
  onOpenDateSheet,
}: MobileReservationBottomBarProps) {
  return (
    <aside className="z-header fixed inset-x-0 bottom-0 h-35 border-t border-gray-100 bg-white md:h-33 2xl:hidden">
      <div className="mx-auto flex h-full w-full items-end justify-center px-4 pb-5 md:px-6 md:pb-4">
        <div className="flex w-full flex-col items-center gap-4 md:gap-3">
          <div className="flex items-end">
            <span className="typo-2lg-bold text-gray-950">₩1,000</span>
            <span className="typo-lg-medium ml-1 text-gray-600">/ 인</span>
          </div>
          <Button size="lg" className="w-full" onClick={onOpenDateSheet}>
            날짜 선택하기
          </Button>
        </div>
      </div>
    </aside>
  );
}

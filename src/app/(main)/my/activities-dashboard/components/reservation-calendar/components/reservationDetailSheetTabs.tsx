import {
  DETAIL_TABS,
  REQUESTS_PAGE_SIZE,
  ReservationTab,
  TAB_LABEL,
} from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/components/reservationDetailSheet.constants';
import { cn } from '@/shared/utils/cn';

interface ReservationDetailSheetTabsProps {
  activeTab: ReservationTab;
  tabCount: Record<ReservationTab, number>;
  onChangeTab: (nextTab: ReservationTab) => void;
  onResetVisibleRequestCount: (count: number) => void;
}

/**
 * 예약 상세 패널 상단 상태 탭 네비게이션
 */
export function ReservationDetailSheetTabs({
  activeTab,
  tabCount,
  onChangeTab,
  onResetVisibleRequestCount,
}: ReservationDetailSheetTabsProps) {
  return (
    <nav className="reservation-detail-sheet__tabs">
      {DETAIL_TABS.map((tabKey) => (
        <button
          key={tabKey}
          type="button"
          onClick={() => {
            onChangeTab(tabKey);
            onResetVisibleRequestCount(REQUESTS_PAGE_SIZE);
          }}
          className={cn(
            'reservation-detail-sheet__tab',
            activeTab === tabKey && 'reservation-detail-sheet__tab--active'
          )}
        >
          {TAB_LABEL[tabKey]} {tabCount[tabKey]}
        </button>
      ))}
    </nav>
  );
}

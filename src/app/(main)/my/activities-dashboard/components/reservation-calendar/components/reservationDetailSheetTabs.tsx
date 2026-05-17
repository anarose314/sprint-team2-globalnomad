import type { CSSProperties } from 'react';
import {
  DETAIL_TABS,
  ReservationTab,
  TAB_LABEL,
} from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/components/reservationDetailSheet.constants';
import { cn } from '@/shared/utils/cn';

interface ReservationDetailSheetTabsProps {
  activeTab: ReservationTab;
  tabCount: Record<ReservationTab, number>;
  onChangeTab: (nextTab: ReservationTab) => void;
}

/**
 * 예약 상세 패널 상단 상태 탭 네비게이션
 */
export function ReservationDetailSheetTabs({
  activeTab,
  tabCount,
  onChangeTab,
}: ReservationDetailSheetTabsProps) {
  const activeIndex = DETAIL_TABS.indexOf(activeTab);
  const tabNavStyle = {
    ['--reservation-detail-tab-index' as string]: activeIndex,
  } as CSSProperties;

  return (
    <nav
      className="reservation-detail-sheet__tabs"
      style={tabNavStyle}
      aria-label="예약 상태 탭"
    >
      {DETAIL_TABS.map((tabKey) => (
        <button
          key={tabKey}
          type="button"
          onClick={() => onChangeTab(tabKey)}
          className={cn(
            'reservation-detail-sheet__tab',
            activeTab === tabKey && 'reservation-detail-sheet__tab--active'
          )}
        >
          {TAB_LABEL[tabKey]} {tabCount[tabKey]}
        </button>
      ))}
      <span className="reservation-detail-sheet__tab-indicator" aria-hidden />
    </nav>
  );
}

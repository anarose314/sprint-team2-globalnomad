import { IcCalendar, IcList, IcSetting, IcUser } from '@/shared/assets/icons';
import type { MenuItem } from '@/shared/components/sidebar/sidebar.types';

export const MENU_ITEMS: MenuItem[] = [
  { href: '/my/profile', label: '내 정보', Icon: IcUser },
  { href: '/my/reservations', label: '예약 내역', Icon: IcList },
  { href: '/my/activities', label: '내 체험 관리', Icon: IcSetting },
  { href: '/my/activities-dashboard', label: '예약 현황', Icon: IcCalendar },
];

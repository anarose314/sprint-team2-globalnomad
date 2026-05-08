import { ReserveTimeProps } from '@/app/(main)/activity/components/reserve-time/reserveTime.types';

export interface FormCalendarProps extends Pick<ReserveTimeProps, 'hasLabel'> {
  onChange: (key: 'date', val: string) => void;
  date: string;
}

import { ReserveTimeProps } from '@/app/(main)/activity/components/reserve-time/reserveTime.types';

type ValuePiece = Date | null;
export type CalendarValue = ValuePiece | [ValuePiece, ValuePiece];

export interface FormCalendarProps extends Pick<ReserveTimeProps, 'hasLabel'> {
  onChange: (key: 'date', val: string) => void;
  date: string;
}

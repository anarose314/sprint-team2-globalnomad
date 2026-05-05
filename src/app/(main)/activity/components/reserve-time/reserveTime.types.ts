export interface Schedule {
  id?: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface ReserveTimeProps {
  value: Schedule;
  onChange: (newValue: Schedule) => void;
  onClick: () => void;
  hasLabel?: boolean;
  isAddAction?: boolean;
  className?: string;
}

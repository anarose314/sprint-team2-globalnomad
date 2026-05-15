type ValuePiece = Date | null;
export type Value = ValuePiece | [ValuePiece, ValuePiece];

export interface FormCalendarProps {
  onChange: (key: 'date', val: string) => void;
  date: string;
  hasLabel?: boolean;
  isError?: boolean;
}

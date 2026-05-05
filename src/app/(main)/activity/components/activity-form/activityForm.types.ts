import { ReactNode, SubmitEvent } from 'react';

export interface ActivityFormProps {
  children: ReactNode;
  onSubmit: (e: SubmitEvent<HTMLFormElement>) => void;
}

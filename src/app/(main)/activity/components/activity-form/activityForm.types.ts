import { ReactNode } from 'react';
import { ActivityFormValues } from '@/app/(main)/activity/components/activity-form/activityForm.schema';

export interface ActivityFormProps {
  children: ReactNode;
  defaultValues?: Partial<ActivityFormValues>;
  onSubmit: (data: ActivityFormValues) => void;
}

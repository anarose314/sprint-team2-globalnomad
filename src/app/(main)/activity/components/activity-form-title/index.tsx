import { Heading } from '@/shared/components/heading';

export function ActivityFormTitle({ children }: { children: React.ReactNode }) {
  return (
    <Heading as="h3" textStyle="typo-lg-bold" className="mb-4.5">
      {children}
    </Heading>
  );
}

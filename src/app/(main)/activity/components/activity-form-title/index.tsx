import { Heading } from '@/shared/components/heading';

export function ActivityFormTitle({ children }: { children: React.ReactNode }) {
  return (
    <Heading as="h3" className="typo-lg-bold mb-4.5">
      {children}
    </Heading>
  );
}

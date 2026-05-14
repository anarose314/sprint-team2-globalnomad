import { Heading } from '@/shared/components/heading';

interface ActivityCardHeadingProps {
  title: string;
}

export function ActivityCardHeading({ title }: ActivityCardHeadingProps) {
  return (
    <Heading as="h3" className="typo-md-bold 2xl:typo-2lg-bold">
      {title}
    </Heading>
  );
}

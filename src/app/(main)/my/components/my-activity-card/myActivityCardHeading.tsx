import { Heading } from '@/shared/components/heading';

interface MyActivityCardHeadingProps {
  title: string;
}

export function MyActivityCardHeading({ title }: MyActivityCardHeadingProps) {
  return (
    <Heading as="h3" className="typo-md-bold 2xl:typo-2lg-bold">
      {title}
    </Heading>
  );
}

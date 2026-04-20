import { HeadingProps } from '@/shared/components/heading/heading.types';
import { cn } from '@/shared/utils/cn';

export function Heading({
  as = 'h2',
  textStyle = 'typo-2lg-bold',
  color = 'text-gray-950',
  className,
  ...props
}: HeadingProps) {
  const Tag = as;

  return (
    <Tag className={cn(textStyle, color, className)} {...props}>
      {props.children}
    </Tag>
  );
}

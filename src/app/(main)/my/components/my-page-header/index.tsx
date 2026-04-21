import { MyPageHeaderProps } from '@/app/(main)/my/components/my-page-header/myPageHeader.types';
import { Heading } from '@/shared/components/heading';
import { cn } from '@/shared/utils/cn';

export function MyPageHeader({
  title,
  description,
  children,
  className,
}: MyPageHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div>
        <Heading>{title}</Heading>
        <p className="typo-md-medium mt-2 text-gray-500">{description}</p>
      </div>
      {children && <div>{children}</div>}
    </div>
  );
}

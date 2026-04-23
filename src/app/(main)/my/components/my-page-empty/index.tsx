import Link from 'next/link';
import { MyPageEmptyProps } from '@/app/(main)/my/components/my-page-empty/myPageEmpty.types';
import { IcEmpty } from '@/shared/assets/icons';

export function MyPageEmpty({ message, buttonLabel, href }: MyPageEmptyProps) {
  return (
    <div className="flex w-full flex-col items-center">
      <IcEmpty className="h-32 w-32" />
      <p className="typo-2lg-medium text-gray-600">{message}</p>
      {/* TODO: 공통 버튼으로 교체 */}
      <Link
        className="bg-primary-500 mt-7.5 flex h-12.5 w-45.5 cursor-pointer items-center justify-center text-white"
        href={href}
      >
        {buttonLabel}
      </Link>
    </div>
  );
}

import Link from 'next/link';
import LogoIcon from '@/shared/assets/logos/logo-vertical.svg';
import { BUTTON_VARIANTS } from '@/shared/components/buttons/button/button.constants';

export default function NotFound() {
  return (
    <div className="bg-gray-25 flex min-h-screen flex-col items-center justify-center px-6 pb-32">
      <Link href="/" className="mb-7" aria-label="홈으로 이동">
        <LogoIcon width={120} height={120} />
      </Link>

      <div className="flex flex-col items-center gap-6 text-center">
        <p className="typo-3xl-bold text-primary-500">404</p>

        <div className="flex flex-col gap-2">
          <h1 className="typo-2xl-bold text-gray-950">
            페이지를 찾을 수 없어요
          </h1>
          <p className="typo-lg-regular text-gray-500">
            요청하신 페이지가 존재하지 않거나 이동되었습니다.
          </p>
        </div>

        <Link href="/" className={BUTTON_VARIANTS({ size: 'md' })}>
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}

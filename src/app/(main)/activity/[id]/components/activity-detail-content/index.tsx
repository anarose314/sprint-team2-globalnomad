import { IcMap } from '@/shared/assets/icons';
import { Heading } from '@/shared/components/heading';
import { cn } from '@/shared/utils/cn';

interface ActivityDetailContentProps {
  description: string;
  address: string;
  className?: string;
}

export function ActivityDetailContent({
  description,
  address,
  className,
}: ActivityDetailContentProps) {
  return (
    <section className={cn('w-full', className)}>
      <div className="mb-5 border-b border-gray-100 pb-5 md:mb-8 md:pb-8 2xl:mb-10 2xl:pb-10">
        <Heading as="h3">체험 설명</Heading>
        <p className="typo-lg-medium mt-4 whitespace-pre-line text-gray-950">
          {description}
        </p>
      </div>

      <div className="mb-5 border-b border-gray-100 pb-5 md:mb-8 md:pb-8 2xl:mb-10 2xl:pb-10">
        <Heading as="h3">오시는 길</Heading>
        <div className="mt-2 flex items-center gap-1">
          <IcMap aria-hidden="true" className="size-4 shrink-0 text-black" />
          <p className="typo-md-semibold text-gray-950">{address}</p>
        </div>

        <div className="mt-4 h-60 w-full rounded-2xl bg-gray-100 md:h-80 md:rounded-3xl 2xl:h-96">
          {/* TODO: 카카오 지도 API 연동 시 이 컨테이너에 마운트 */}
        </div>
      </div>
    </section>
  );
}

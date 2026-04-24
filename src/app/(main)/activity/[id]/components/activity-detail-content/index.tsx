<<<<<<< HEAD
import { Heading } from '@/shared/components/heading';
=======
>>>>>>> b70724b (✨ Feat: 체험 상세 페이지 중단 UI 마크업(체험 설명, 오시는 길))
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
<<<<<<< HEAD
      <div className="mb-5 border-b border-gray-100 pb-5 md:mb-8 md:pb-8 2xl:mb-10 2xl:pb-10">
        <Heading as="h3">체험 설명</Heading>
=======
      <div className="mb-5 border-b border-gray-100 pb-5 md:mb-[30px] md:pb-[30px] lg:mb-10 lg:pb-10">
        <h3 className="typo-2lg-bold text-gray-950">체험 설명</h3>
>>>>>>> b70724b (✨ Feat: 체험 상세 페이지 중단 UI 마크업(체험 설명, 오시는 길))
        <p className="typo-lg-medium mt-4 whitespace-pre-line text-gray-950">
          {description}
        </p>
      </div>

<<<<<<< HEAD
      <div className="mb-5 border-b border-gray-100 pb-5 md:mb-8 md:pb-8 2xl:mb-10 2xl:pb-10">
        <Heading as="h3">오시는 길</Heading>
        <p className="typo-md-semibold mt-2 text-gray-950">{address}</p>

        <div className="mt-4 h-60 w-full rounded-2xl bg-gray-100 md:h-80 md:rounded-3xl 2xl:h-96">
=======
      <div className="mb-5 border-b border-gray-100 pb-5 md:mb-[30px] md:pb-[30px] lg:mb-10 lg:pb-10">
        <h3 className="typo-2lg-bold text-gray-950">오시는 길</h3>
        <p className="typo-md-semibold mt-2 text-gray-950">{address}</p>

        <div className="mt-4 h-[240px] w-full rounded-2xl bg-gray-100 md:h-[320px] md:rounded-3xl lg:h-[360px]">
>>>>>>> b70724b (✨ Feat: 체험 상세 페이지 중단 UI 마크업(체험 설명, 오시는 길))
          {/* TODO: 카카오 지도 API 연동 시 이 컨테이너에 마운트 */}
        </div>
      </div>
    </section>
  );
}

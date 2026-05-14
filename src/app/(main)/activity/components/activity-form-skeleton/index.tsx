import { Skeleton } from '@/shared/components/skeleton';

/**
 * 체험 폼 스켈레톤 UI
 */
export function ActivityFormSkeleton() {
  return (
    <div className="mt-6 flex flex-col gap-7.5" aria-hidden="true">
      {/* 1. 기본 정보 섹션 */}
      <section className="flex flex-col gap-6">
        {/* 제목 */}
        <div className="flex w-full flex-col gap-2">
          <Skeleton height={20} className="w-12" />
          <Skeleton height={48} fullWidth rounded="md" />
        </div>
        {/* 카테고리 */}
        <div className="flex w-full flex-col gap-2">
          <Skeleton height={20} className="w-16" />
          <Skeleton height={48} fullWidth rounded="md" />
        </div>
        {/* 설명 */}
        <div className="flex w-full flex-col gap-2">
          <Skeleton height={20} className="w-12" />
          <Skeleton height={150} fullWidth rounded="md" />
        </div>
        {/* 가격 */}
        <div className="flex w-full flex-col gap-2">
          <Skeleton height={20} className="w-12" />
          <Skeleton height={48} fullWidth rounded="md" />
        </div>
        {/* 주소 */}
        <div className="flex w-full flex-col gap-2">
          <Skeleton height={20} className="w-12" />
          <Skeleton height={48} fullWidth rounded="md" />
        </div>
      </section>

      {/* 2. 예약 가능한 시간대 섹션 */}
      <section>
        <Skeleton height={24} className="mb-4 w-36" />
        <div className="flex flex-col gap-5">
          <div className="flex w-full flex-wrap items-end gap-3.5 border-b border-gray-100 pb-5 md:flex-nowrap">
            {/* 날짜 */}
            <div className="flex w-full flex-col gap-2 md:w-auto md:flex-1">
              <Skeleton height={20} className="w-12" />
              <Skeleton height={48} fullWidth rounded="md" />
            </div>
            {/* 시간 및 버튼 */}
            <div className="flex flex-1 flex-wrap items-end gap-2.25 md:flex-3 md:flex-nowrap">
              <div className="flex w-full flex-col gap-2 md:w-31">
                <Skeleton height={20} className="w-16" />
                <Skeleton height={48} fullWidth rounded="md" />
              </div>
              <span className="relative bottom-3.5 shrink-0 text-gray-200">
                -
              </span>
              <div className="flex w-full flex-col gap-2 md:w-31">
                <Skeleton height={20} className="w-16" />
                <Skeleton height={48} fullWidth rounded="md" />
              </div>
              {/* 추가/삭제 버튼 크기 */}
              <Skeleton
                height={42}
                className="xs:bottom-1.5 xs:w-10.5 bottom-0 w-full shrink-0"
                rounded="xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. 배너 이미지 등록 섹션 */}
      <section>
        <Skeleton height={24} className="mb-4 w-32" />
        <div className="grid w-full grid-cols-3 gap-3 md:grid-cols-5 2xl:gap-3.5">
          {/* AddImageButton 자리 */}
          <Skeleton className="aspect-square w-full" rounded="md" />
          {/* 배너 이미지 미리보기 자리 */}
          <Skeleton className="aspect-square w-full" rounded="md" />
        </div>
      </section>

      {/* 4. 소개 이미지 등록 섹션 */}
      <section>
        <Skeleton height={24} className="mb-4 w-32" />
        <div className="grid w-full grid-cols-3 gap-3 md:grid-cols-5 2xl:gap-3.5">
          {/* AddImageButton 자리 */}
          <Skeleton className="aspect-square w-full" rounded="md" />
          {/* 소개 이미지 미리보기 자리 */}
          <Skeleton className="aspect-square w-full" rounded="md" />
          <Skeleton className="aspect-square w-full" rounded="md" />
          <Skeleton className="aspect-square w-full" rounded="md" />
        </div>
      </section>

      {/* 5. 수정하기 버튼 */}
      <Skeleton height={48} className="mx-auto mt-2 w-30" rounded="md" />
    </div>
  );
}

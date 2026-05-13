import { Skeleton } from '@/shared/components/skeleton';

export function ReserveListSkeleton() {
  return (
    <ul className="flex flex-col gap-5 wrap-anywhere">
      {Array.from({ length: 3 }).map((_, i) => (
        <li key={i}>
          <article className="flex flex-col gap-3 border-b border-b-gray-50 pb-7.5">
            {/* 카드 영역 */}
            <div className="flex overflow-hidden rounded-2xl border border-gray-100 bg-white">
              <div className="flex flex-1 flex-col justify-center gap-2 px-4 py-4">
                {/* 뱃지 */}
                <Skeleton width={60} height={24} rounded="md" />

                <div>
                  {/* 제목 */}
                  <Skeleton className="mb-2 w-3/4" height={24} />
                  {/* 날짜 · 시간 상세 정보 (한 줄로 통합) */}
                  <Skeleton className="w-[60%]" height={20} />
                </div>

                {/* 가격 및 인원 */}
                <Skeleton width={120} height={28} />
              </div>

              {/* 이미지 영역 */}
              <div className="relative w-1/3 shrink-0 md:w-1/4">
                <Skeleton fullWidth height="100%" rounded="none" />
              </div>
            </div>

            {/* 하단 버튼 영역 */}
            <Skeleton fullWidth height={48} rounded="lg" />
          </article>
        </li>
      ))}
    </ul>
  );
}

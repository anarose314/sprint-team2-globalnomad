import { KebabDropdown } from '@/app/(main)/activity/[id]/components/activity-info-header/kebab-dropdown';
import { IcMap, IcStar } from '@/shared/assets/icons';
import { cn } from '@/shared/utils/cn';

export interface ActivityInfoHeaderProps {
  category: string;
  title: string;
  rating: number;
  reviewCount: number;
  address: string;
  /** 내가 만든 체험이면 true → 케밥 메뉴 노출 */
  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

/**
 * 체험 상세 페이지 상단 타이틀 영역
 *
 * 반응형 타이포그래피
 * - 카테고리 : 모바일 pretendard-13m gray-700 / PC·TB pretendard-14m gray-700
 * - 제목     : 모바일 pretendard-18B gray-950  / PC·TB pretendard-24B gray-950
 * - 별점     : IcStar 16×16 yellow-500, 텍스트 pretendard-14m gray-700
 * - 위치     : IcMap  16×16 black,      텍스트 pretendard-14m gray-700
 *
 * `isOwner=true`이면 우측에 케밥 메뉴(수정 / 삭제) 표시
 */
export function ActivityInfoHeader({
  category,
  title,
  rating,
  reviewCount,
  address,
  isOwner = false,
  onEdit,
  onDelete,
  className,
}: ActivityInfoHeaderProps) {
  const formattedRating = Number.isFinite(rating) ? rating.toFixed(1) : '-';

  return (
    <div className={cn('flex flex-col', className)}>
      {/* 카테고리 + 케밥 */}
      <div className="flex items-center justify-between">
        <span className="typo-sm-medium md:typo-md-medium tracking-tight text-gray-700">
          {category}
        </span>
        {isOwner && <KebabDropdown onEdit={onEdit} onDelete={onDelete} />}
      </div>

      {/* 제목 */}
      <h2 className="typo-2lg-bold md:typo-2xl-bold mt-1 tracking-tight text-gray-950">
        {title}
      </h2>

      {/* 별점 */}
      <div className="mt-1 flex items-center gap-1">
        <IcStar
          aria-hidden="true"
          className="size-4 shrink-0 text-yellow-500"
        />
        <span className="typo-md-medium tracking-tight text-gray-700">
          {formattedRating}
        </span>
        <span className="typo-md-medium tracking-tight text-gray-700">
          ({reviewCount})
        </span>
      </div>

      {/* 위치 */}
      <div className="mt-0.5 flex items-center gap-1">
        <IcMap aria-hidden="true" className="size-4 shrink-0 text-black" />
        <span className="typo-md-medium tracking-tight text-gray-700">
          {address}
        </span>
      </div>
    </div>
  );
}

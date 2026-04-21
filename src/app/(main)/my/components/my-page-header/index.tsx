import { MyPageHeaderProps } from '@/app/(main)/my/components/my-page-header/myPageHeader.types';
import { Heading } from '@/shared/components/heading';
import { cn } from '@/shared/utils/cn';

/**
 * 마이페이지의 각 섹션 상단에 사용되는 헤더 컴포넌트
 *
 * @example
 * // 1. 우측 액션 요소 X
 * <MyPageHeader
 * title="예약 현황"
 * description="내 체험에 예약된 내역들을 한 눈에 확인할 수 있습니다."
 * />
 *
 * // 2. 우측에 액션 요소 O
 * <MyPageHeader
 * title="내 체험 관리"
 * description="체험을 등록하거나 수정 및 삭제가 가능합니다."
 * >
 * <button>체험 등록하기</button>
 * </MyPageHeader>
 */
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

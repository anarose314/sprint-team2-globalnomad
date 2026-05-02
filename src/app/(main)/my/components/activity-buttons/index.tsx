import { ActivityButtonsProps } from '@/app/(main)/my/components/activity-buttons/activityButtons.types';
import { Button } from '@/shared/components/buttons';

/**
 * [예약 내역] 및 [내 체험 관리] 에서 사용하는 하단 액션 버튼 그룹 컴포넌트
 * @example
 * <ActivityButtons
 *   leftText="수정하기" onLeftClick={handleEdit}
 *   rightText="삭제하기" onRightClick={handleDelete}
 * />
 */
export function ActivityButtons({
  leftText,
  onLeftClick,
  rightText,
  onRightClick,
}: ActivityButtonsProps) {
  return (
    <ul className="flex gap-3 [&>li]:flex-1">
      <li>
        <Button
          variant="secondary"
          size="md"
          className="w-full"
          onClick={onLeftClick}
        >
          {leftText}
        </Button>
      </li>
      <li>
        <Button
          variant="secondary"
          size="md"
          className="bg-gray-25 w-full"
          onClick={onRightClick}
        >
          {rightText}
        </Button>
      </li>
    </ul>
  );
}

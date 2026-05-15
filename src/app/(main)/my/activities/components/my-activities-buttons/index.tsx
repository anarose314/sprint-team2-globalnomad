import { MyActivityCardActionsProps } from '@/app/(main)/my/activities/components/my-activities-buttons/myActivitiesButtons.types';
import { Button } from '@/shared/components/buttons';

export function MyActivitiesButtons({
  isDeleting,
  onEdit,
  onDelete,
}: MyActivityCardActionsProps) {
  return (
    <ul className="flex gap-3 *:flex-1">
      <li>
        <Button
          variant="secondary"
          size="md"
          className="w-full"
          onClick={onEdit}
        >
          수정하기
        </Button>
      </li>
      <li>
        <Button
          variant="secondary"
          size="md"
          className="bg-gray-25 w-full"
          onClick={onDelete}
          disabled={isDeleting}
        >
          삭제하기
        </Button>
      </li>
    </ul>
  );
}

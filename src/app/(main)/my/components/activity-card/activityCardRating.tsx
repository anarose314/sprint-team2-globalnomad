import { IcStar } from '@/shared/assets/icons';

interface ActivityCardRatingProps {
  rating: number;
  reviewCount: number;
}

export function ActivityCardRating({
  rating,
  reviewCount,
}: ActivityCardRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      <IcStar className="w-3.5 text-yellow-500" />
      <p className="typo-sm-medium 2xl:typo-lg-medium text-gray-500">
        {rating} ({reviewCount})
      </p>
    </div>
  );
}

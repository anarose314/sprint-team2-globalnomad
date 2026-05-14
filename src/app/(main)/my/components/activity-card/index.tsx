import { ActivityCardButtons } from '@/app/(main)/my/components/activity-card/activityCardButtons';
import { ActivityCardDateTime } from '@/app/(main)/my/components/activity-card/activityCardDateTime';
import { ActivityCardHeading } from '@/app/(main)/my/components/activity-card/activityCardHeading';
import { ActivityCardInfo } from '@/app/(main)/my/components/activity-card/activityCardInfo';
import { ActivityCardLayout } from '@/app/(main)/my/components/activity-card/activityCardLayout';
import { ActivityCardPrice } from '@/app/(main)/my/components/activity-card/activityCardPrice';
import { ActivityCardRating } from '@/app/(main)/my/components/activity-card/activityCardRating';
import { ActivityCardStatus } from '@/app/(main)/my/components/activity-card/activityCardStatus';

/**
 * [예약 내역] 및 [내 체험 관리] 목록에서 사용하는 카드 형태의 컴파운드 컴포넌트
 * 레이아웃 내에 정보 영역(Info)과 하단 액션 영역(Buttons)을 분리하여 목적에 맞게 조합
 *
 * @example
 * <ActivityCard>
 *   <ActivityCard.Info
 *     priority={true}
 *     title="체험 제목"
 *     activityId={123}
 *     bannerImageUrl="/image.png"
 *   >
 *     <ActivityCard.Status status="pending" />
 *     <ActivityCard.Heading title="체험 제목" />
 *     <ActivityCard.Price price={15000} headCount={2} />
 *   </ActivityCard.Info>
 *
 *   <ActivityCard.Buttons>
 *     <Button>수정하기</Button>
 *     <Button>삭제하기</Button>
 *   </ActivityCard.Buttons>
 * </ActivityCard>
 */
export const ActivityCard = Object.assign(ActivityCardLayout, {
  Info: ActivityCardInfo,
  Buttons: ActivityCardButtons,
  // 서브 파츠
  DateTime: ActivityCardDateTime,
  Heading: ActivityCardHeading,
  Price: ActivityCardPrice,
  Rating: ActivityCardRating,
  Status: ActivityCardStatus,
});

import { MyActivityCardButtons } from '@/app/(main)/my/components/my-activity-card/myActivityCardButtons';
import { MyActivityCardDateTime } from '@/app/(main)/my/components/my-activity-card/myActivityCardDateTime';
import { MyActivityCardHeading } from '@/app/(main)/my/components/my-activity-card/myActivityCardHeading';
import { MyActivityCardInfo } from '@/app/(main)/my/components/my-activity-card/myActivityCardInfo';
import { MyActivityCardLayout } from '@/app/(main)/my/components/my-activity-card/myActivityCardLayout';
import { MyActivityCardPrice } from '@/app/(main)/my/components/my-activity-card/myActivityCardPrice';
import { MyActivityCardRating } from '@/app/(main)/my/components/my-activity-card/myActivityCardRating';
import { MyActivityCardStatus } from '@/app/(main)/my/components/my-activity-card/myActivityCardStatus';

/**
 * [예약 내역] 및 [내 체험 관리] 목록에서 사용하는 카드 형태의 컴파운드 컴포넌트
 * 레이아웃 내에 정보 영역(Info)과 하단 액션 영역(Buttons)을 분리하여 목적에 맞게 조합
 *
 * @example
 * <MyActivityCard>
 *   <MyActivityCard.Info
 *     priority={true}
 *     title="체험 제목"
 *     activityId={123}
 *     bannerImageUrl="/image.png"
 *   >
 *     <MyActivityCard.Status status="pending" />
 *     <MyActivityCard.Heading title="체험 제목" />
 *     <MyActivityCard.Price price={15000} headCount={2} />
 *   </ActivityCard.Info>
 *
 *   <MyActivityCard.Buttons>
 *     <Button>수정하기</Button>
 *     <Button>삭제하기</Button>
 *   </MyActivityCard.Buttons>
 * </MyActivityCard>
 */
export const MyActivityCard = Object.assign(MyActivityCardLayout, {
  Info: MyActivityCardInfo,
  Buttons: MyActivityCardButtons,
  // 서브 파츠
  DateTime: MyActivityCardDateTime,
  Heading: MyActivityCardHeading,
  Price: MyActivityCardPrice,
  Rating: MyActivityCardRating,
  Status: MyActivityCardStatus,
});

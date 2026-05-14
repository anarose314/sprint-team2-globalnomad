import { IcStar } from '@/shared/assets/icons';
import { Button } from '@/shared/components/buttons/button';
import { Heading } from '@/shared/components/heading';
import { ModalBase } from '@/shared/components/modal/ModalBase';

interface ReviewModalProps {
  title: string;
  description: string;
  reviewText: string;
  selectedRating: number;
  onRatingChange: (rating: number) => void;
  onReviewTextChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  isPending: boolean;
}

const SECTION_TITLE = '소중한 경험을 들려주세요';
const PLACEHOLDER = '체험에서 느낀 경험을 자유롭게 남겨주세요';
const MAX_LENGTH = 100;

/**
 * 리뷰 작성 모달 컴포넌트
 *
 * - 사용자가 별점과 텍스트 리뷰를 작성할 수 있는 모달 UI
 * - 별점 선택, 텍스트 입력은 외부 상태로 제어되는 controlled 컴포넌트 방식으로 동작
 * - ModalBase를 기반으로 공통 모달 구조를 사용
 *
 * @example *
 * <ReviewModal *
 *   title="함께 배우면 즐거운 스트릿 댄스"
 *   description="2023.02.14 / 11:00 - 12:30"
 *   reviewText={reviewText}
 *   selectedRating={rating}
 *   onRatingChange={setRating}
 *   onReviewTextChange={setReviewText}
 *   onClose={handleClose}
 *   onSubmit={handleSubmit}
 * />
 */
export function ReviewModal({
  title,
  description,
  reviewText,
  selectedRating,
  onRatingChange,
  onReviewTextChange,
  onClose,
  onSubmit,
  isPending,
}: ReviewModalProps) {
  return (
    <ModalBase
      className="max-h-9/10 max-w-96.25 overflow-y-auto"
      bodyClassName="px-7.5 pt-6 pb-7.5"
      onClose={onClose}
    >
      <div className="mt-2 flex h-full flex-col">
        {/* 타이틀 & 날짜 */}
        <div className="flex w-full flex-col items-center gap-1.5">
          <Heading
            as="h2"
            textStyle="typo-lg-bold"
            className="w-full truncate text-center text-gray-950"
          >
            {title}
          </Heading>
          <p className="typo-md-medium text-center leading-normal text-gray-500">
            {description}
          </p>
        </div>

        {/* 별점 */}
        <div className="mx-auto mt-3.5 grid w-full max-w-60 grid-cols-5 gap-2 sm:mt-2.5 sm:gap-3">
          {' '}
          {Array.from({ length: 5 }).map((_, index) => {
            const rating = index + 1;
            const isFilled = rating <= selectedRating;

            return (
              <button
                key={rating}
                type="button"
                aria-label={`${rating}점`}
                aria-pressed={isFilled}
                onClick={() => onRatingChange(rating)}
                className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
              >
                <IcStar
                  className={`h-auto w-full ${isFilled ? 'text-yellow-500' : 'text-gray-200'}`}
                />
              </button>
            );
          })}
        </div>

        {/* 입력 */}
        <div className="mt-7.5 flex flex-col">
          <p className="typo-2lg-bold text-gray-950">{SECTION_TITLE}</p>

          <textarea
            value={reviewText}
            onChange={(e) => onReviewTextChange(e.target.value)}
            maxLength={MAX_LENGTH}
            placeholder={PLACEHOLDER}
            className="typo-lg-medium mt-4 h-42 w-full resize-none rounded-2xl border border-gray-100 bg-white px-5 py-5 leading-normal text-gray-950 outline-none placeholder:text-gray-400"
          />
          <p className="typo-md-medium mt-2 text-right leading-none text-gray-500">
            {reviewText.length}/{MAX_LENGTH}
          </p>
        </div>

        {/* 버튼 */}
        <div className="mt-4.5">
          <Button
            variant="primary"
            size="lg"
            onClick={onSubmit}
            className="w-full"
            disabled={isPending}
          >
            {isPending ? '리뷰 작성 중...' : '작성하기'}
          </Button>
        </div>
      </div>
    </ModalBase>
  );
}

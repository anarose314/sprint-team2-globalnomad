import { IcStar } from '@/shared/assets/icons';
import { Button } from '@/shared/components/buttons/button';
import { ModalBase } from '@/shared/components/modal/ModalBase';

interface ReviewModalProps {
  title?: string;
  dateText?: string;
  sectionTitle?: string;
  placeholder?: string;
  reviewText?: string;
  maxLength?: number;
  selectedRating?: number;
  onRatingChange?: (rating: number) => void;
  onReviewTextChange?: (value: string) => void;
  onClose?: () => void;
  onSubmit?: () => void;
}

export function ReviewModal({
  title,
  dateText,
  sectionTitle = '소중한 경험을 들려주세요',
  placeholder = '체험에서 느낀 경험을 자유롭게 남겨주세요',
  reviewText = '',
  maxLength = 100,
  selectedRating = 0,
  onRatingChange,
  onReviewTextChange,
  onClose,
  onSubmit,
}: ReviewModalProps) {
  return (
    <ModalBase
      className="h-130.75 max-w-96.25"
      bodyClassName="px-7.5 pt-6 pb-7.5"
      footerClassName="hidden"
      onClose={onClose}
    >
      <div className="relative flex h-full flex-col">
        <div className="mt-8.5 flex flex-col items-center">
          <h2 className="typo-lg-bold text-center leading-[1.4] text-gray-950">
            {title}
          </h2>

          <p className="typo-md-medium mt-1.5 text-center leading-normal text-gray-500">
            {dateText}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2">
          {Array.from({ length: 5 }).map((_, index) => {
            const rating = index + 1;
            const isFilled = rating <= selectedRating;

            return (
              <button
                key={rating}
                type="button"
                aria-label={`${rating}점`}
                onClick={() => onRatingChange?.(rating)}
              >
                <IcStar
                  className={`h-10 w-10 ${isFilled ? 'text-yellow-400' : 'text-gray-200'}`}
                />
              </button>
            );
          })}
        </div>

        <div className="mt-7.5 flex flex-col gap-4">
          <p className="typo-2lg-bold leading-[1.4] text-gray-950">
            {sectionTitle}
          </p>

          <textarea
            value={reviewText}
            onChange={(e) => onReviewTextChange?.(e.target.value)}
            maxLength={maxLength}
            placeholder={placeholder}
            className="typo-lg-medium h-42 w-full resize-none rounded-2xl border border-gray-100 bg-white px-5 py-5 leading-normal text-gray-950 outline-none placeholder:text-gray-400"
          />
        </div>

        <div className="mt-auto flex flex-col gap-4">
          <p className="typo-md-medium mt-1 text-right leading-none text-gray-500">
            {reviewText.length}/{maxLength}
          </p>

          <Button
            variant="primary"
            size="lg"
            onClick={onSubmit}
            className="w-full"
          >
            작성하기
          </Button>
        </div>
      </div>
    </ModalBase>
  );
}

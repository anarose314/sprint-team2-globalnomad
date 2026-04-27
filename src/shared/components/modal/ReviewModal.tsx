import type { SVGProps } from 'react';
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

interface StarIconProps extends SVGProps<SVGSVGElement> {
  filled?: boolean;
}

function StarIcon({ filled = false, ...props }: StarIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill={filled ? 'currentColor' : 'none'}
      {...props}
    >
      <path
        d="M12 2.8l2.6 5.27 5.82.85-4.21 4.1.99 5.78L12 16.9l-5.2 2.9.99-5.78-4.21-4.1 5.82-.85L12 2.8z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ReviewModal({
  title = '함께 배우면 즐거운 스트릿 댄스',
  dateText = '2023. 02. 14 / 11:00 - 12:30 (10명)',
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
      className="h-130.75 max-w-96.25 rounded-3xl"
      bodyClassName="px-[30px] pt-6 pb-[30px]"
      footerClassName="hidden"
    >
      <div className="relative flex h-full flex-col">
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className="absolute top-0 right-0 flex h-6 w-6 items-center justify-center text-black"
        >
          <span className="text-[24px] leading-none">×</span>
        </button>

        <div className="mt-8.5 flex flex-col items-center">
          <h2 className="text-center text-lg leading-[1.4] font-bold text-gray-950">
            {title}
          </h2>

          <p className="text-md mt-1.5 text-center leading-normal font-medium text-gray-500">
            {dateText}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2">
          {Array.from({ length: 5 }).map((_, index) => {
            const rating = index + 1;
            const isFilled = index <= selectedRating;

            return (
              <button
                key={rating}
                type="button"
                aria-label={`${rating}점`}
                onClick={() => onRatingChange?.(rating)}
                className={isFilled ? 'text-yellow-400' : 'text-gray-200'}
              >
                <StarIcon filled={isFilled} className="h-10 w-10" />
              </button>
            );
          })}
        </div>

        <div className="mt-7.5 flex flex-col gap-4">
          <p className="text-2lg leading-[1.4] font-bold text-gray-950">
            {sectionTitle}
          </p>

          <textarea
            value={reviewText}
            onChange={(e) => onReviewTextChange?.(e.target.value)}
            maxLength={maxLength}
            placeholder={placeholder}
            className="h-42 w-full resize-none rounded-2xl border border-gray-100 bg-white px-5 py-5 text-lg leading-normal font-medium text-gray-950 outline-none placeholder:text-gray-400"
          />
        </div>

        <div className="mt-auto flex flex-col gap-4">
          <p className="text-md mt-1 text-right leading-none font-medium text-gray-500">
            {reviewText.length}/{maxLength}
          </p>

          <button
            type="button"
            onClick={onSubmit}
            className="bg-primary-500 h-14 w-full rounded-2xl text-lg font-bold text-white"
          >
            작성하기
          </button>
        </div>
      </div>
    </ModalBase>
  );
}

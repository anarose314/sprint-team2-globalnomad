interface ActivityCardPriceProps {
  price: number;
  headCount?: number;
}

export function ActivityCardPrice({
  price,
  headCount,
}: ActivityCardPriceProps) {
  return (
    <p className="typo-lg-bold 2xl:typo-2lg-bold mt-1 flex items-center gap-1 text-gray-950">
      ₩{price.toLocaleString('ko-KR')}
      <span className="typo-md-medium 2xl:typo-lg-medium text-gray-400">
        {headCount ? `· ${headCount}명` : '/ 인'}
      </span>
    </p>
  );
}

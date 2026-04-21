import { HeadingProps } from '@/shared/components/heading/heading.types';
import { cn } from '@/shared/utils/cn';

/**
 * 전역 공통 타이포그래피 컴포넌트
 *
 * @example
 * // 1. 기본 사용 (h2, typo-2lg-bold, text-gray-950)
 * <Heading>제목</Heading>
 *
 * // 2. 태그 및 텍스트 스타일 변경
 * <Heading as="h3" textStyle="typo-lg-bold" className="md:typo-2xl-bold text-center">
 * 제목
 * </Heading>
 */
export function Heading({
  as = 'h2',
  textStyle = 'typo-2lg-bold',
  color = 'text-gray-950',
  className,
  children,
  ...props
}: HeadingProps) {
  const Tag = as;

  return (
    <Tag className={cn(textStyle, color, className)} {...props}>
      {children}
    </Tag>
  );
}

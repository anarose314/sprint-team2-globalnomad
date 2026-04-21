import { HTMLAttributes } from 'react';

type HeadingTag = 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

type TextStyleToken =
  // Extra Small - 12px
  | 'typo-xs-regular'
  | 'typo-xs-medium'
  | 'typo-xs-semibold'
  // Small - 13px
  | 'typo-sm-medium'
  | 'typo-sm-semibold'
  // Medium - 14px
  | 'typo-md-regular'
  | 'typo-md-medium'
  | 'typo-md-semibold'
  | 'typo-md-bold'
  // Large - 16px
  | 'typo-lg-regular'
  | 'typo-lg-medium'
  | 'typo-lg-semibold'
  | 'typo-lg-bold'
  // 2Large - 18px
  | 'typo-2lg-regular'
  | 'typo-2lg-medium'
  | 'typo-2lg-semibold'
  | 'typo-2lg-bold'
  // Extra Large - 20px
  | 'typo-xl-regular'
  | 'typo-xl-medium'
  | 'typo-xl-semibold'
  | 'typo-xl-bold'
  // 2Extra Large - 24px
  | 'typo-2xl-regular'
  | 'typo-2xl-medium'
  | 'typo-2xl-semibold'
  | 'typo-2xl-bold'
  // 3Extra Large - 32px
  | 'typo-3xl-semibold'
  | 'typo-3xl-bold';

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingTag;
  textStyle?: TextStyleToken;
  color?: string;
}

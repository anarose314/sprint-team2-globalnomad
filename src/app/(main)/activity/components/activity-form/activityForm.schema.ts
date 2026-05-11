import z from 'zod';
import { CATEGORY_VALUES } from '@/shared/constants/category.constants';

const timeSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  startTime: z.string(),
  endTime: z.string(),
});

const scheduleSchema = z.object({
  date: z.string(),
  times: z.array(timeSchema),
});

/**
 * 체험 등록/수정 폼 검증 스키마.
 */
export const activityFormSchema = z.object({
  title: z.string().trim().min(1, '제목을 입력해 주세요'),
  category: z.enum(CATEGORY_VALUES, {
    error: () => ({ message: '카테고리를 선택해 주세요' }),
  }),
  description: z.string().trim().min(1, '설명을 입력해 주세요'),
  price: z
    .number({
      error: () => ({ message: '가격을 입력해 주세요' }),
    })
    .min(1, '가격은 1원 이상이어야 합니다.'),
  address: z
    .string({
      error: () => ({ message: '주소를 입력해 주세요' }),
    })
    .trim()
    .min(1, '주소를 입력해 주세요'),
  schedules: z
    .array(scheduleSchema)
    .min(1, '예약 가능한 시간대는 최소 1개 이상 등록해주세요'),
  bannerImageUrl: z.string().min(1, '배너 이미지를 등록해 주세요'),
  subImageUrls: z.array(z.string()).max(4).optional(),
});

/**
 * 체험 등록/수정 폼 데이터 타입.
 */
export type ActivityFormValues = z.infer<typeof activityFormSchema>;

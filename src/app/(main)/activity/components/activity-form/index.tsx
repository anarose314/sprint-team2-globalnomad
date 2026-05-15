'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  activityFormSchema,
  ActivityFormValues,
} from '@/app/(main)/activity/components/activity-form/activityForm.schema';
import { ActivityFormProps } from '@/app/(main)/activity/components/activity-form/activityForm.types';
import { FormImage } from '@/app/(main)/activity/components/form-image';
import { FormTitle } from '@/app/(main)/activity/components/form-title';
import { KakaoPostcode } from '@/app/(main)/activity/components/kakao-postcode';
import { ReserveTimeList } from '@/app/(main)/activity/components/reserve-time-list';
import { Dropdown } from '@/shared/components/dropdown';
import { Input } from '@/shared/components/input';
import { Textarea } from '@/shared/components/textarea';
import { CATEGORY_OPTIONS } from '@/shared/constants/category.constants';

export function ActivityForm({
  children,
  defaultValues,
  onSubmit,
}: ActivityFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    clearErrors,
  } = useForm<ActivityFormValues>({
    mode: 'onTouched',
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      ...defaultValues,
      address: defaultValues?.address || '',
      schedules: defaultValues?.schedules || [],
      bannerImageUrl: defaultValues?.bannerImageUrl || '',
      subImageUrls: defaultValues?.subImageUrls || [],
    },
  });

  return (
    <form
      className="mt-6 flex flex-col gap-7.5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <section className="flex flex-col gap-6">
        <Input
          label="제목"
          placeholder="제목을 입력해 주세요"
          errorMessage={errors.title?.message}
          {...register('title')}
        />
        <Controller
          name="category"
          control={control}
          render={({ field: { value, onChange, onBlur } }) => (
            <Dropdown
              label="카테고리"
              variant="fieldInput"
              value={value || ''}
              onChange={onChange}
              onBlur={onBlur}
              options={CATEGORY_OPTIONS}
              placeholder="카테고리를 선택해 주세요"
              errorMessage={errors.category?.message}
            />
          )}
        />
        <Textarea
          label="설명"
          placeholder="체험에 대한 설명을 입력해 주세요"
          errorMessage={errors.description?.message}
          {...register('description')}
        />
        <Input
          label="가격"
          type="number"
          placeholder="체험 금액을 입력해 주세요"
          errorMessage={errors.price?.message}
          {...register('price', { valueAsNumber: true })}
        />
        <Controller
          name="address"
          control={control}
          render={({ field: { value, onChange, onBlur } }) => (
            <KakaoPostcode
              address={value || ''}
              onAddressChange={onChange}
              onBlur={onBlur}
              errorMessage={errors.address?.message}
            />
          )}
        />
      </section>
      <section>
        <FormTitle>예약 가능한 시간대</FormTitle>
        <Controller
          name="schedules"
          control={control}
          render={({ field: { value, onChange } }) => (
            <ReserveTimeList
              schedules={value || []}
              onSchedulesChange={onChange}
              errorMessage={errors.schedules?.message}
              clearError={() => clearErrors('schedules')}
            />
          )}
        />
      </section>
      <section>
        <FormTitle>배너 이미지 등록</FormTitle>
        <Controller
          name="bannerImageUrl"
          control={control}
          render={({ field: { value, onChange } }) => (
            <FormImage
              value={value}
              onChange={onChange}
              errorMessage={errors.bannerImageUrl?.message}
            />
          )}
        />
      </section>
      <section>
        <FormTitle>소개 이미지 등록</FormTitle>
        <Controller
          name="subImageUrls"
          control={control}
          render={({ field: { value, onChange } }) => (
            <FormImage
              value={value}
              onChange={onChange}
              errorMessage={errors.subImageUrls?.message}
              isMultiple
            />
          )}
        />
      </section>
      {children}
    </form>
  );
}

'use client';

import { useState } from 'react';
import { ActivityFormProps } from '@/app/(main)/activity/components/activity-form/activityForm.types';
import { FormImage } from '@/app/(main)/activity/components/form-image';
import { FormTitle } from '@/app/(main)/activity/components/form-title';
import { KakaoPostcode } from '@/app/(main)/activity/components/kakao-postcode';
import { ReserveTimeList } from '@/app/(main)/activity/components/reserve-time-list';
import { Dropdown } from '@/shared/components/dropdown';
import { Input } from '@/shared/components/input';
import { Textarea } from '@/shared/components/textarea';
import { CATEGORY_OPTIONS } from '@/shared/constants/category.constants';

export function ActivityForm({ children, onSubmit }: ActivityFormProps) {
  const [category, setCategory] = useState('');

  return (
    <form className="mt-6 flex flex-col gap-7.5" onSubmit={onSubmit}>
      <section className="flex flex-col gap-6">
        <Input
          label="제목"
          name="title"
          placeholder="제목을 입력해 주세요"
          required
        />
        <Dropdown
          label="카테고리"
          name="category"
          options={CATEGORY_OPTIONS}
          value={category}
          placeholder="카테고리를 선택해 주세요"
          onChange={(value) => setCategory(value)}
          triggerClassName="border-gray-100"
          menuClassName="border-gray-100"
        />
        <Textarea
          label="설명"
          name="description"
          placeholder="체험에 대한 설명을 입력해 주세요"
          required
        />
        <Input
          label="가격"
          type="number"
          name="price"
          placeholder="체험 금액을 입력해 주세요"
          required
        />
        <KakaoPostcode />
      </section>
      <section>
        <FormTitle>예약 가능한 시간대</FormTitle>
        <ReserveTimeList />
      </section>
      <section>
        <FormTitle>배너 이미지 등록</FormTitle>
        <FormImage name="bannerImageUrl" />
      </section>
      <section>
        <FormTitle>소개 이미지 등록</FormTitle>
        <FormImage name="subImageUrls" isMultiple />
      </section>
      {children}
    </form>
  );
}

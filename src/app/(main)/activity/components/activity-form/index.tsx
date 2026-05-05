'use client';

import { useState } from 'react';
import { ActivityFormProps } from '@/app/(main)/activity/components/activity-form/activityForm.types';
import { FormImage } from '@/app/(main)/activity/components/form-image';
import { FormTitle } from '@/app/(main)/activity/components/form-title';
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
        <Input label="제목" placeholder="제목을 입력해 주세요" required />
        <Dropdown
          label="카테고리"
          options={CATEGORY_OPTIONS}
          value={category}
          placeholder="카테고리를 선택해 주세요"
          onChange={(value) => setCategory(value)}
          triggerClassName="border-gray-100"
          menuClassName="border-gray-100"
        />
        <Textarea
          label="설명"
          placeholder="체험에 대한 설명을 입력해 주세요"
          required
        />
        <Input
          label="가격"
          type="number"
          placeholder="체험 금액을 입력해 주세요"
          required
        />
        {/* TODO: 우편번호 서비스 연동 */}
        <Input label="주소" placeholder="주소를 입력해 주세요" required />
      </section>
      <section>
        <FormTitle>예약 가능한 시간대</FormTitle>
        <ReserveTimeList />
      </section>
      <section>
        <FormTitle>배너 이미지 등록</FormTitle>
        <FormImage />
      </section>
      <section>
        <FormTitle>소개 이미지 등록</FormTitle>
        <FormImage isMultiple />
      </section>
      {children}
    </form>
  );
}

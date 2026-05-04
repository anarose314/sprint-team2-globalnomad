'use client';

import { useState } from 'react';
import {
  ACTIVITY_OPTIONS,
  CATEGORY_OPTIONS,
  PRICE_OPTIONS,
  TIME_OPTIONS,
} from '@/app/(main)/dropdown-test/dropdownTest.constants';
import { Dropdown } from '@/shared/components/dropdown';

export default function DropdownTestPage() {
  const [activityId, setActivityId] = useState('');
  const [category, setCategory] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [priceSort, setPriceSort] = useState('');

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto flex max-w-3xl flex-col gap-10">
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-gray-950">
            예약 현황 드롭다운
          </h2>

          <Dropdown
            options={ACTIVITY_OPTIONS}
            value={activityId}
            placeholder="체험을 선택해주세요"
            onChange={(value) => setActivityId(value)}
          />
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-gray-950">
            카테고리 드롭다운
          </h2>

          <Dropdown
            options={CATEGORY_OPTIONS}
            value={category}
            placeholder="카테고리"
            onChange={(value) => setCategory(value)}
          />
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-gray-950">시간 드롭다운</h2>

          <div className="flex gap-4">
            <Dropdown
              options={TIME_OPTIONS}
              value={startTime}
              placeholder="0:00"
              className="w-40"
              onChange={(value) => setStartTime(value)}
            />

            <Dropdown
              options={TIME_OPTIONS}
              value={endTime}
              placeholder="0:00"
              className="w-40"
              onChange={(value) => setEndTime(value)}
            />
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-gray-950">
            가격 필터 드롭다운
          </h2>

          <Dropdown
            variant="chip"
            options={PRICE_OPTIONS}
            value={priceSort}
            placeholder="가격"
            onChange={(value) => setPriceSort(value)}
          />
        </section>
      </div>
    </main>
  );
}

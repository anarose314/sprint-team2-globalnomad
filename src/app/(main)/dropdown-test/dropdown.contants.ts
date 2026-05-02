import type { DropdownOption } from '@/shared/components/dropdown/dropdown.types';

export const CATEGORY_OPTIONS: DropdownOption[] = [
  { label: '문화 · 예술', value: 'culture' },
  { label: '식음료', value: 'food' },
  { label: '스포츠', value: 'sports' },
  { label: '투어', value: 'tour' },
  { label: '관광', value: 'sightseeing' },
  { label: '웰빙', value: 'wellbeing' },
];

export const PRICE_OPTIONS: DropdownOption[] = [
  { label: '가격 낮은 순', value: 'price_asc' },
  { label: '가격 높은 순', value: 'price_desc' },
];

export const ACTIVITY_OPTIONS: DropdownOption[] = [
  { label: '함께 배우면 즐거운 스트릿 댄스', value: 'activity-1' },
  { label: '도심 속 감성 쿠킹 클래스', value: 'activity-2' },
  { label: '한강에서 즐기는 선셋 요가', value: 'activity-3' },
  { label: '서울 야경 사진 클래스', value: 'activity-4' },
  { label: '성수동 도자기 원데이 클래스', value: 'activity-5' },
  { label: '북촌 한옥마을 투어', value: 'activity-6' },
];

export const TIME_OPTIONS: DropdownOption[] = Array.from(
  { length: 48 },
  (_, index) => {
    const hour = Math.floor(index / 2);
    const minute = index % 2 === 0 ? '00' : '30';

    return {
      label: `${hour}:${minute}`,
      value: `${String(hour).padStart(2, '0')}:${minute}`,
    };
  }
);

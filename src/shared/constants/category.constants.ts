export const CATEGORY_OPTIONS = [
  { label: '문화 · 예술', value: 'culture' },
  { label: '식음료', value: 'food' },
  { label: '스포츠', value: 'sports' },
  { label: '투어', value: 'tour' },
  { label: '관광', value: 'sightseeing' },
  { label: '웰빙', value: 'wellbeing' },
];

export const CATEGORY_VALUES = CATEGORY_OPTIONS.map(
  (option) => option.value
) as [string, ...string[]];

export const CATEGORY_OPTIONS = [
  { label: '문화 · 예술', value: '문화 · 예술' },
  { label: '식음료', value: '식음료' },
  { label: '스포츠', value: '스포츠' },
  { label: '투어', value: '투어' },
  { label: '관광', value: '관광' },
  { label: '웰빙', value: '웰빙' },
];

export const CATEGORY_VALUES = CATEGORY_OPTIONS.map(
  (option) => option.value
) as [string, ...string[]];

// src/shared/constants/time.constants.ts

export const TIME_OPTIONS = Array.from({ length: 48 }, (_, index) => {
  const hour = Math.floor(index / 2);
  const minute = index % 2 === 0 ? '00' : '30';

  return {
    label: `${hour}:${minute}`,
    value: `${String(hour).padStart(2, '0')}:${minute}`,
  };
});

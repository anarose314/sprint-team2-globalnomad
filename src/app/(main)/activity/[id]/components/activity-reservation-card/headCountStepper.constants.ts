/**
 * 예약 카드「참여 인원 수」영역의 +/- 아이콘 버튼 공통 스타일
 * (공통 Button과 별도: 24×24 원형 히트 영역·아이콘 전용)
 *
 * box-shadow는 사각형 박스를 따라가므로, 호버 깊이감은 SVG에만 drop-shadow 적용
 *
 * 눌림은 :active 구간이 매우 짧아 transform이 거의 보이지 않을 수 있어
 * `HeadCountStepperIconButton`에서 pointer/키보드 pressed 시 아래 ADDON을 합침
 */
export const HEAD_COUNT_STEPPER_ICON_BUTTON_CLASS =
  'inline-flex h-6 w-6 shrink-0 cursor-pointer select-none items-center justify-center rounded-full ' +
  'text-gray-800 transition-[transform,filter] duration-100 ease-out ' +
  'enabled:hover:-translate-y-px enabled:hover:[&_svg]:drop-shadow-sm ' +
  'motion-reduce:enabled:hover:translate-y-0 motion-reduce:enabled:hover:[&_svg]:drop-shadow-none';

/** pointer down / Space·Enter hold 동안만 `cn(base, ADDON)`으로 병합 */
export const HEAD_COUNT_STEPPER_PRESSED_ADDON_CLASS =
  'translate-y-px scale-[0.86] duration-75 [&_svg]:drop-shadow-none ease-in ' +
  'motion-reduce:translate-y-0 motion-reduce:scale-100';

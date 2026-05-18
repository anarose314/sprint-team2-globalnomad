'use client';

import { createContext, useContext } from 'react';

export type ModalOverlayCloseContextValue = {
  /** 닫기 애니메이션 후 부모 `onClose`를 호출합니다. `ModalOverlay` 바깥에서는 no-op입니다. */
  requestClose: () => void;
};

export const ModalOverlayCloseContext =
  createContext<ModalOverlayCloseContextValue | null>(null);

export function useRequestModalClose(): ModalOverlayCloseContextValue | null {
  return useContext(ModalOverlayCloseContext);
}

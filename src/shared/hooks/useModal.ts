'use client';

import { useState } from 'react';

interface UseModalReturn {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

/**
 * 모달의 열림/닫힘 상태와 제어 함수를 제공하는 공통 훅입니다.
 *
 * @example
 * const { isOpen, openModal, closeModal } = useModal();
 */
export const useModal = (defaultOpen = false): UseModalReturn => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    openModal,
    closeModal,
  };
};

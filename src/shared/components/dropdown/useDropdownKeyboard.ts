import type { KeyboardEvent as ReactKeyboardEvent, RefObject } from 'react';
import { useEffect, useRef } from 'react';
import type { DropdownOption } from '@/shared/components/dropdown/dropdown.types';

interface UseDropdownKeyboardProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  options: DropdownOption[];
  value: string | number | undefined | null;
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  handleOptionClick: (option: DropdownOption) => void;
  listboxRef: RefObject<HTMLUListElement | null>;
  optionHeight: number;
  menuMaxHeight: number;
}

/**
 * 드롭다운의 키보드 탐색(방향키, Enter) 및 Typeahead 기능을 관리합니다.
 */
export const useDropdownKeyboard = ({
  isOpen,
  setIsOpen,
  options,
  value,
  focusedIndex,
  setFocusedIndex,
  handleOptionClick,
  listboxRef,
  optionHeight,
  menuMaxHeight,
}: UseDropdownKeyboardProps) => {
  const searchString = useRef('');
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 컴포넌트 언마운트 시 메모리 누수 방지
  useEffect(() => {
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, []);

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const { key } = event;

    // 비활성화된 옵션은 건너뛰기
    const getNextIndex = (current: number, step: number): number => {
      let next = current + step;
      while (next >= 0 && next < options.length) {
        if (!options[next].disabled) return next;
        next += step;
      }
      return current;
    };

    // 1. 타이핑 검색 로직 (Typeahead)
    // 일반 문자/숫자 키가 눌렸을 때 (Ctrl, Alt 등 특수키 제외)
    if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      searchString.current += key.toLowerCase();

      // 500ms가 지나면 누적된 문자열 초기화 (연속 타이핑 감지용)
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      searchTimeout.current = setTimeout(() => {
        searchString.current = '';
      }, 500);

      // 누적된 문자열로 시작하는 첫 번째 옵션 찾기
      const matchIndex = options.findIndex(
        (option) =>
          !option.disabled &&
          option.label.toLowerCase().startsWith(searchString.current)
      );

      if (matchIndex !== -1) {
        setFocusedIndex(matchIndex);
        if (!isOpen) {
          handleOptionClick(options[matchIndex]);
        } else if (listboxRef.current) {
          listboxRef.current.scrollTop = matchIndex * optionHeight;
        }
      }
      return;
    }

    // 2. 방향키 및 엔터 로직
    if (!['ArrowDown', 'ArrowUp', 'Enter'].includes(key)) return;
    event.preventDefault();

    // 메뉴가 닫혀있을 때
    if (!isOpen) {
      if (key === 'Enter') {
        const currentIndex = options.findIndex((opt) => opt.value === value);
        setFocusedIndex(currentIndex !== -1 ? currentIndex : -1);
        return setIsOpen(true);
      }

      const currentIndex = Math.max(
        options.findIndex((opt) => opt.value === value),
        0
      );

      const nextIndex =
        key === 'ArrowDown'
          ? getNextIndex(currentIndex, 1)
          : getNextIndex(currentIndex, -1);

      setFocusedIndex(nextIndex);
      handleOptionClick(options[nextIndex]);
      return;
    }

    // 메뉴가 열려있을 때
    if (key === 'Enter') {
      if (focusedIndex >= 0 && focusedIndex < options.length) {
        handleOptionClick(options[focusedIndex]);
      }
      return;
    }

    const nextIndex =
      key === 'ArrowDown'
        ? getNextIndex(focusedIndex, 1)
        : getNextIndex(focusedIndex, -1);

    setFocusedIndex(nextIndex);

    // 방향키 이동 시 스크롤 보정
    if (listboxRef.current && nextIndex !== focusedIndex) {
      if (key === 'ArrowDown') {
        const itemBottom = (nextIndex + 1) * optionHeight;
        const visibleBottom = listboxRef.current.scrollTop + menuMaxHeight;
        if (itemBottom > visibleBottom) {
          listboxRef.current.scrollTop = itemBottom - menuMaxHeight;
        }
      } else {
        const itemTop = nextIndex * optionHeight;
        const visibleTop = listboxRef.current.scrollTop;
        if (itemTop < visibleTop) {
          listboxRef.current.scrollTop = itemTop;
        }
      }
    }
  };

  return { handleKeyDown };
};

/**
 * Pagination 컴포넌트의 Props
 */
export type PaginationProps = {
  /** 현재 활성화된 페이지 번호 (1부터 시작) */
  currentPage: number;
  /** 전체 페이지 수 */
  totalPages: number;
  /** 페이지 번호 클릭 시 호출되는 핸들러 */
  onPageChange: (page: number) => void;
};

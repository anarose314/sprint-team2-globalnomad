import { IcGithub } from '@/shared/assets/icons';
import {
  FOOTER_COPYRIGHT_TEXT,
  FOOTER_GITHUB_URL,
} from '@/shared/components/footer/footer.constants';

/**
 * 메인 페이지 공통 Footer 컴포넌트
 *
 * - 서비스 하단에 저작권 문구와 팀 GitHub 저장소 링크를 표시한다.
 *
 * @example
 * <Footer />
 */
export function Footer() {
  return (
    <footer className="h-20 shrink-0 border-t border-gray-50 bg-white">
      <div className="mx-auto flex h-full w-full max-w-380 min-w-0 items-center justify-between gap-4 px-4 md:px-10 2xl:px-0">
        <p className="typo-md-medium truncate text-gray-500">
          {FOOTER_COPYRIGHT_TEXT}
        </p>

        <a
          href={FOOTER_GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="팀 GitHub 저장소 새 탭에서 열기"
          className="flex h-8 w-8 shrink-0 items-center justify-center"
        >
          <IcGithub className="h-6 w-6 text-gray-600" aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}

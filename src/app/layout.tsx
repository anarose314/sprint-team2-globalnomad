import type { Metadata } from 'next';
import Script from 'next/script';
import { QueryProvider } from '@/shared/components/query-provider';
import { ToastContainer } from '@/shared/components/toast/toast-container';
import '@/app/styles/globals.css';

const siteUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : process.env.NEXT_PUBLIC_APP_URL || 'https://globalnomad-team2.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Global Nomad',
    template: '%s | Global Nomad',
  },
  description:
    '호스트의 체험 등록부터 게스트의 예약 및 리뷰까지 지원하는 통합 플랫폼 GlobalNomad',
  openGraph: {
    title: 'Global Nomad',
    description:
      '호스트의 체험 등록부터 게스트의 예약 및 리뷰까지 지원하는 통합 플랫폼 GlobalNomad',
    url: 'https://globalnomad-team2.vercel.app',
    images: '/og-image.png',
  },
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko" className={'h-full antialiased'}>
      <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
      <noscript>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </noscript>
      <body className="flex min-h-full flex-col font-sans">
        <Script id="pretendard-font-loader" strategy="afterInteractive">
          {`
            (function () {
              const href =
                'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css';
              if (document.querySelector('link[data-pretendard]')) return;

              const link = document.createElement('link');
              link.rel = 'stylesheet';
              link.href = href;
              link.setAttribute('data-pretendard', 'true');
              document.head.appendChild(link);
            })();
          `}
        </Script>
        <ToastContainer />
        <QueryProvider>{children}</QueryProvider>
        <div id="modal-root" />
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { QueryProvider } from '@/shared/components/query-provider';
import { ToastContainer } from '@/shared/components/toast/toast-container';
import '@/app/styles/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'https://globalnomad-team2.vercel.app'
  ),
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={'h-full antialiased'}>
      <body className="flex min-h-full flex-col font-sans">
        <ToastContainer />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}

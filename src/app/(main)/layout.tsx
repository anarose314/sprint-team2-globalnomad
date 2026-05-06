import { MainLayoutWrapper } from '@/app/(main)/components/main-layout-wrapper';
import { Footer } from '@/shared/components/footer';
import { Header } from '@/shared/components/header';

type MainLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <Header />

      <MainLayoutWrapper>{children}</MainLayoutWrapper>

      <Footer />
    </>
  );
}

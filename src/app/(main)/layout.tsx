import { MainHeaderWithDrawer } from '@/app/(main)/components/main-header-with-drawer';
import { MainLayoutWrapper } from '@/app/(main)/components/main-layout-wrapper';
import { Footer } from '@/shared/components/footer';

type MainLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <MainHeaderWithDrawer />

      <MainLayoutWrapper>{children}</MainLayoutWrapper>

      <Footer />
    </>
  );
}

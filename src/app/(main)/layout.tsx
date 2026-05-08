import { MainHeaderWithDrawer } from '@/app/(main)/components/main-header-with-drawer';
import { Footer } from '@/shared/components/footer';

type MainLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <MainHeaderWithDrawer />

      {children}

      <Footer />
    </>
  );
}

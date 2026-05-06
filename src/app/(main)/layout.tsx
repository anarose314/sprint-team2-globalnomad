import { Footer } from '@/shared/components/footer';
import { Header } from '@/shared/components/header';

type MainLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <Header />

      <div className="flex w-full grow px-6 md:px-7.5">
        <main className="mx-auto flex w-full max-w-280 flex-col">
          {children}
        </main>
      </div>

      <Footer />
    </>
  );
}

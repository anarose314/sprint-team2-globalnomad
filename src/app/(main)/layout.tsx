type MainLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      {/* TODO: 헤더 작업 */}
      <header className="bg-primary-50 flex h-20 shrink-0 items-center px-4">
        Header
      </header>
      <div className="flex w-full grow px-6 md:px-7.5">
        <main className="mx-auto flex w-full max-w-280 flex-col">
          {children}
        </main>
      </div>
      {/* TODO: 푸터 작업 */}
      <footer className="bg-primary-50 flex h-20 shrink-0 items-center px-4">
        Footer
      </footer>
    </>
  );
}

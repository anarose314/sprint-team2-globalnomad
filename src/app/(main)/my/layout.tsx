import { Sidebar } from '@/shared/components/sidebar';

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto mt-10 flex w-full max-w-245 items-start md:gap-7.5 2xl:gap-12.5">
      <div className="md:sticky md:top-10 md:self-start">
        <Sidebar />
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

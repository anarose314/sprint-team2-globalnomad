import { Sidebar } from '@/shared/components/sidebar';

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto mt-10 flex w-full max-w-245 md:gap-7.5 lg:gap-12.5">
      <Sidebar />
      <div className="flex-1">{children}</div>
    </div>
  );
}

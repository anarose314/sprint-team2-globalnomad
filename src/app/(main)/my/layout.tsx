import { Sidebar } from '@/shared/components/sidebar';

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-6xl gap-6 p-6">
      <Sidebar />
      <div className="flex-1">{children}</div>
    </div>
  );
}

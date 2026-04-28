import { Sidebar } from '@/shared/components/sidebar';

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto mt-10 flex w-fit items-start md:gap-7.5 2xl:gap-12.5">
      <Sidebar />
      <div>{children}</div>
    </div>
  );
}

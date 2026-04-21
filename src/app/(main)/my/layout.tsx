'use client';

import Sidebar from '@/shared/components/sidebar';

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const handleProfileEdit = () => {
    // TODO: 프로필 수정 버튼 이벤트 연동 후 콘솔 로그 지우기
    console.log('프로필 수정 클릭');
  };

  const handleLogout = () => {
    // TODO: 로그아웃 버튼 이벤트 연동 후 콘솔 로그 지우기
    console.log('로그아웃 클릭');
  };

  return (
    <div className="mx-auto flex max-w-6xl gap-6 p-6">
      <Sidebar onProfileEdit={handleProfileEdit} onLogout={handleLogout} />
      <main className="flex-1">{children}</main>
    </div>
  );
}

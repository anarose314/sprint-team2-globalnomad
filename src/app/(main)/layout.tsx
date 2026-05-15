import { MainHeaderWithDrawer } from '@/app/(main)/components/main-header-with-drawer';
import { MainLayoutWrapper } from '@/app/(main)/components/main-layout-wrapper';
import { ApiError } from '@/shared/apis/apiError';
import type { User } from '@/shared/apis/auth/auth.types';
import { fetchInstanceServer } from '@/shared/apis/fetchInstance.server';
import { Footer } from '@/shared/components/footer';
import type { HeaderUser } from '@/shared/components/header/header.types';

type MainLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const getCurrentHeaderUser = async (): Promise<HeaderUser | undefined> => {
  try {
    const user = await fetchInstanceServer<User>('/users/me', {
      cache: 'no-store',
    });

    return {
      nickname: user.nickname,
      profileImageUrl: user.profileImageUrl,
    };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return undefined;
    }

    throw error;
  }
};

export default async function MainLayout({ children }: MainLayoutProps) {
  const user = await getCurrentHeaderUser();

  return (
    <>
      <MainHeaderWithDrawer user={user} />

      <MainLayoutWrapper>{children}</MainLayoutWrapper>

      <Footer />
    </>
  );
}

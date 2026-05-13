import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { ProfileForm } from '@/app/(main)/my/profile/components/profile-form';
import { myInfoOptions } from '@/app/(main)/my/profile/hooks/useMyInfo';
import type { User } from '@/shared/apis/auth/auth.types';
import { fetchInstanceServer } from '@/shared/apis/fetchInstance.server';

export async function ProfileContainer() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    ...myInfoOptions(),
    queryFn: () => fetchInstanceServer<User>('/users/me'),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileForm />
    </HydrationBoundary>
  );
}

import { MyActivitiesClientList } from '@/app/(main)/my/activities/components/my-activities-client-list';
import { fetchInstanceServer } from '@/shared/apis/fetchInstance.server';
import { MyActivitiesResponse } from '@/shared/types/myActivities.types';

export async function MyActivitiesList() {
  const data = await fetchInstanceServer<MyActivitiesResponse>(
    '/my-activities?size=5'
  );

  return (
    <>
      <section className="mt-7.5">
        <ul className="flex flex-col gap-5 wrap-anywhere">
          <MyActivitiesClientList initialData={data} />
        </ul>
      </section>
    </>
  );
}

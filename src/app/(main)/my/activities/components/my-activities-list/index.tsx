import { MY_ACTIVITIES_SIZE } from '@/app/(main)/my/activities/activities.constants';
import { MyActivitiesClientList } from '@/app/(main)/my/activities/components/my-activities-client-list';
import { fetchInstanceServer } from '@/shared/apis/fetchInstance.server';
import { MyActivitiesResponse } from '@/shared/types/myActivities.types';

export async function MyActivitiesList() {
  const data = await fetchInstanceServer<MyActivitiesResponse>(
    `/my-activities?size=${MY_ACTIVITIES_SIZE}`
  );

  return (
    <section className="mt-7.5">
      <MyActivitiesClientList initialData={data} />
    </section>
  );
}

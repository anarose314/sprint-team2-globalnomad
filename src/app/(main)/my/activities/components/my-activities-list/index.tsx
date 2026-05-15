'use client';

import { useInView } from 'react-intersection-observer';
import { useActivityActions } from '@/app/(main)/activity/hooks/useActivityActions';
import { MyActivitiesButtons } from '@/app/(main)/my/activities/components/my-activities-buttons';
import { useMyActivitiesInfinite } from '@/app/(main)/my/activities/hooks/useMyActivitiesInfinite';
import { MyActivityCard } from '@/app/(main)/my/components/my-activity-card';
import { MyPageEmpty } from '@/app/(main)/my/components/my-page-empty';
import { TwoButtonModal } from '@/shared/components/modal';
import { ModalOverlay } from '@/shared/components/modal/modal-overlay';
import { Spinner } from '@/shared/components/spinner';

export function MyActivitiesList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMyActivitiesInfinite();

  const { ref } = useInView({
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  const activitiesList =
    data?.pages.flatMap((page) => page?.activities ?? []) ?? [];

  const {
    isOpen,
    isDeleting,
    handleEdit,
    handleDeleteRequest,
    handleDeleteCancel,
    handleDeleteConfirm,
  } = useActivityActions();

  return (
    <>
      {activitiesList.length === 0 ? (
        <MyPageEmpty
          message="아직 등록한 체험이 없어요"
          buttonLabel="체험 등록하기"
          href="/activity/add"
        />
      ) : (
        <>
          <ul className="flex flex-col gap-7.5 wrap-anywhere">
            {activitiesList.map((activity, index) => {
              const { id, title, bannerImageUrl, rating, reviewCount, price } =
                activity;

              return (
                <MyActivityCard key={id}>
                  <MyActivityCard.Info
                    priority={index === 0}
                    title={title}
                    activityId={id}
                    bannerImageUrl={bannerImageUrl}
                  >
                    <MyActivityCard.Heading title={title} />
                    <MyActivityCard.Rating
                      rating={rating}
                      reviewCount={reviewCount}
                    />
                    <MyActivityCard.Price price={price} />
                  </MyActivityCard.Info>
                  <MyActivityCard.Buttons>
                    <MyActivitiesButtons
                      isDeleting={isDeleting}
                      onEdit={() => handleEdit(id)}
                      onDelete={() => handleDeleteRequest(id)}
                    />
                  </MyActivityCard.Buttons>
                </MyActivityCard>
              );
            })}
          </ul>

          {isOpen && (
            <ModalOverlay onClose={handleDeleteCancel}>
              <TwoButtonModal
                message="정말 이 체험을 삭제하시겠습니까?"
                cancelText="취소"
                confirmText="삭제"
                onCancel={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
              />
            </ModalOverlay>
          )}
        </>
      )}
      <div ref={ref} className="flex h-20 items-center justify-center">
        {isFetchingNextPage && <Spinner />}
      </div>
    </>
  );
}

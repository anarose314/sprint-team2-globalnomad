import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  confirmReservationAndDeclinePending,
  MissingReservationScheduleError,
} from '@/app/(main)/my/activities-dashboard/apis/reservations';
import { ApiError } from '@/shared/apis/apiError';
import { fetchInstanceClient } from '@/shared/apis/fetchInstance.client';

vi.mock('@/shared/apis/fetchInstance.client', () => ({
  fetchInstanceClient: vi.fn(),
}));

const fetchInstanceClientMock = vi.mocked(fetchInstanceClient);

const pendingReservation = (id: number) => ({
  id,
  nickname: `사용자${id}`,
  headCount: 1,
  scheduleId: 30,
  status: 'pending',
  createdAt: '2026-07-28T00:00:00.000Z',
});

describe('confirmReservationAndDeclinePending', () => {
  beforeEach(() => {
    fetchInstanceClientMock.mockReset();
  });

  it('공식 상태 변경 API로 승인한 뒤 같은 스케줄의 대기 예약을 거절한다', async () => {
    fetchInstanceClientMock
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce({
        cursorId: null,
        totalCount: 2,
        reservations: [pendingReservation(12), pendingReservation(13)],
      })
      .mockResolvedValue(undefined);

    await confirmReservationAndDeclinePending({
      activityId: 10,
      reservationId: 11,
      scheduleId: 30,
    });

    expect(fetchInstanceClientMock).toHaveBeenNthCalledWith(
      1,
      '/api/proxy/my-activities/10/reservations/11',
      {
        method: 'PATCH',
        body: { status: 'confirmed' },
      }
    );
    expect(fetchInstanceClientMock).toHaveBeenNthCalledWith(
      2,
      '/api/proxy/my-activities/10/reservations',
      {
        params: {
          scheduleId: 30,
          status: 'pending',
          size: 50,
        },
      }
    );
    expect(fetchInstanceClientMock).toHaveBeenNthCalledWith(
      3,
      '/api/proxy/my-activities/10/reservations/12',
      {
        method: 'PATCH',
        body: { status: 'declined' },
      }
    );
    expect(fetchInstanceClientMock).toHaveBeenNthCalledWith(
      4,
      '/api/proxy/my-activities/10/reservations/13',
      {
        method: 'PATCH',
        body: { status: 'declined' },
      }
    );
    expect(
      fetchInstanceClientMock.mock.calls.some(([url]) =>
        String(url).endsWith('/approve')
      )
    ).toBe(false);
  });

  it('승인 요청이 404로 실패하면 기능 미지원으로 간주해 다른 요청으로 우회하지 않는다', async () => {
    const error = new ApiError('예약을 찾을 수 없습니다.', 404);
    fetchInstanceClientMock.mockRejectedValueOnce(error);

    await expect(
      confirmReservationAndDeclinePending({
        activityId: 10,
        reservationId: 11,
        scheduleId: 30,
      })
    ).rejects.toBe(error);

    expect(fetchInstanceClientMock).toHaveBeenCalledTimes(1);
    expect(fetchInstanceClientMock).toHaveBeenCalledWith(
      '/api/proxy/my-activities/10/reservations/11',
      {
        method: 'PATCH',
        body: { status: 'confirmed' },
      }
    );
  });

  it('예약 시간 정보가 없으면 승인 요청을 보내지 않는다', async () => {
    await expect(
      confirmReservationAndDeclinePending({
        activityId: 10,
        reservationId: 11,
        scheduleId: null,
      })
    ).rejects.toBeInstanceOf(MissingReservationScheduleError);

    expect(fetchInstanceClientMock).not.toHaveBeenCalled();
  });
});

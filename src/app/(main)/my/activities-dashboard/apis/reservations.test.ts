import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  confirmReservationAndDeclinePending,
  declinePendingReservationIds,
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

    const result = await confirmReservationAndDeclinePending({
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
    expect(result).toEqual({
      confirmedReservationId: 11,
      autoDecline: {
        succeededIds: [12, 13],
        failed: [],
      },
      pendingCollectionError: null,
    });
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

  it('승인 후 대기 예약 조회가 실패하면 승인 성공과 조회 실패를 함께 반환한다', async () => {
    const error = new ApiError('대기 예약을 불러오지 못했습니다.', 500);
    fetchInstanceClientMock
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(error);

    const result = await confirmReservationAndDeclinePending({
      activityId: 10,
      reservationId: 11,
      scheduleId: 30,
    });

    expect(result).toEqual({
      confirmedReservationId: 11,
      autoDecline: {
        succeededIds: [],
        failed: [],
      },
      pendingCollectionError: error,
    });
    expect(fetchInstanceClientMock).toHaveBeenCalledTimes(2);
  });
});

describe('declinePendingReservationIds', () => {
  beforeEach(() => {
    fetchInstanceClientMock.mockReset();
  });

  it('12건을 동시에 최대 5건까지만 처리한다', async () => {
    let activeRequestCount = 0;
    let maxActiveRequestCount = 0;

    fetchInstanceClientMock.mockImplementation(async () => {
      activeRequestCount += 1;
      maxActiveRequestCount = Math.max(
        maxActiveRequestCount,
        activeRequestCount
      );

      await new Promise((resolve) => {
        setTimeout(resolve, 1);
      });

      activeRequestCount -= 1;
      return undefined;
    });

    const reservationIds = Array.from({ length: 12 }, (_, index) => index + 1);
    const result = await declinePendingReservationIds(10, reservationIds, {
      maxRetries: 0,
      retryDelayMs: 0,
    });

    expect(maxActiveRequestCount).toBe(5);
    expect(fetchInstanceClientMock).toHaveBeenCalledTimes(12);
    expect(result).toEqual({
      succeededIds: reservationIds,
      failed: [],
    });
  });

  it('실패한 예약만 다시 시도한다', async () => {
    const attemptsByReservationId = new Map<number, number>();

    fetchInstanceClientMock.mockImplementation(async (url) => {
      const reservationId = Number(String(url).split('/').at(-1));
      const attempts = (attemptsByReservationId.get(reservationId) ?? 0) + 1;
      attemptsByReservationId.set(reservationId, attempts);

      if ((reservationId === 3 || reservationId === 7) && attempts === 1) {
        throw new Error(`${reservationId}번 거절 실패`);
      }

      return undefined;
    });

    const reservationIds = Array.from({ length: 12 }, (_, index) => index + 1);
    const result = await declinePendingReservationIds(10, reservationIds, {
      maxRetries: 1,
      retryDelayMs: 0,
    });

    expect(result).toEqual({
      succeededIds: reservationIds,
      failed: [],
    });
    expect(attemptsByReservationId.get(3)).toBe(2);
    expect(attemptsByReservationId.get(7)).toBe(2);
    expect(attemptsByReservationId.get(1)).toBe(1);
    expect(fetchInstanceClientMock).toHaveBeenCalledTimes(14);
  });

  it('재시도 후에도 실패한 예약 번호와 원인을 반환한다', async () => {
    const error = new Error('3번 거절 실패');

    fetchInstanceClientMock.mockImplementation(async (url) => {
      const reservationId = Number(String(url).split('/').at(-1));
      if (reservationId === 3) throw error;
      return undefined;
    });

    const result = await declinePendingReservationIds(10, [1, 2, 3, 4, 5], {
      maxRetries: 2,
      retryDelayMs: 0,
    });

    expect(result).toEqual({
      succeededIds: [1, 2, 4, 5],
      failed: [{ reservationId: 3, reason: error }],
    });
    expect(fetchInstanceClientMock).toHaveBeenCalledTimes(7);
  });

  it('요청을 다시 보내도 해결되지 않는 오류는 재시도하지 않는다', async () => {
    const error = new ApiError('이미 처리된 예약입니다.', 400);
    fetchInstanceClientMock.mockRejectedValue(error);

    const result = await declinePendingReservationIds(10, [3], {
      maxRetries: 2,
      retryDelayMs: 0,
    });

    expect(result).toEqual({
      succeededIds: [],
      failed: [{ reservationId: 3, reason: error }],
    });
    expect(fetchInstanceClientMock).toHaveBeenCalledTimes(1);
  });
});

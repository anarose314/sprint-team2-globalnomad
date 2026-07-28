import { ApiError } from '@/shared/apis/apiError';
import { fetchInstanceClient } from '@/shared/apis/fetchInstance.client';

const RESERVATION_PAGE_SIZE = 10;
/** 대기 예약 일괄 거절 시 동시 PATCH 상한(동시 연결·서버 부하 완화) */
const DECLINE_PENDING_RESERVATIONS_CONCURRENCY = 5;
/** 대기 예약 거절 실패 시 추가 시도 횟수 */
const DECLINE_PENDING_RESERVATIONS_MAX_RETRIES = 2;
/** 거절 재시도 전 기본 대기 시간(ms) */
const DECLINE_PENDING_RESERVATIONS_RETRY_DELAY_MS = 300;
type ReservationRequestStatus = 'pending' | 'confirmed' | 'declined';

interface ReservationRequestItem {
  id: number;
  nickname: string;
  headCount: number;
  scheduleId: number;
  status: ReservationRequestStatus;
  createdAt: string;
}

interface ReservationRequestsResponse {
  cursorId: number | null;
  totalCount: number;
  reservations: ReservationRequestItem[];
}

interface FetchActivityReservationsProps {
  activityId: number;
  scheduleId: number;
  status: ReservationRequestStatus;
  cursorId?: number | null;
  /** 목록 조회 page size, 생략 시 UI 목록과 동일한 페이지 크기(10) */
  size?: number;
}

interface UpdateActivityReservationStatusProps {
  activityId: number;
  reservationId: number;
  status: 'confirmed' | 'declined';
}

interface ConfirmReservationAndDeclinePendingProps {
  activityId: number;
  reservationId: number;
  scheduleId: number | null;
}

interface DeclinePendingReservationIdsOptions {
  maxRetries?: number;
  retryDelayMs?: number;
}

interface ActivityReservationsResponseLike {
  cursorId?: unknown;
  totalCount?: unknown;
  reservations?: unknown;
}

export class MissingReservationScheduleError extends Error {
  constructor() {
    super('예약 시간 정보를 확인할 수 없습니다.');
    this.name = 'MissingReservationScheduleError';
  }
}

export interface DeclinePendingReservationFailure {
  reservationId: number;
  reason: unknown;
}

export interface DeclinePendingReservationIdsResult {
  succeededIds: number[];
  failed: DeclinePendingReservationFailure[];
}

export interface ConfirmReservationAndDeclinePendingResult {
  confirmedReservationId: number;
  autoDecline: DeclinePendingReservationIdsResult;
  pendingCollectionError: unknown | null;
}

/**
 * 특정 체험/스케줄/상태 기준 예약 내역 목록을 커서 페이징으로 조회
 */
export const fetchActivityReservations = async ({
  activityId,
  scheduleId,
  status,
  cursorId = null,
  size = RESERVATION_PAGE_SIZE,
}: FetchActivityReservationsProps): Promise<ReservationRequestsResponse> => {
  const response = await fetchInstanceClient<unknown>(
    `/api/proxy/my-activities/${activityId}/reservations`,
    {
      params: {
        scheduleId,
        status,
        size,
        ...(cursorId !== null && { cursorId }),
      },
    }
  );

  const normalized =
    response && typeof response === 'object'
      ? (response as ActivityReservationsResponseLike)
      : {};

  const reservations = Array.isArray(normalized.reservations)
    ? normalized.reservations
    : [];

  return {
    cursorId:
      typeof normalized.cursorId === 'number' ? normalized.cursorId : null,
    totalCount:
      typeof normalized.totalCount === 'number' ? normalized.totalCount : 0,
    reservations: reservations
      .map((item) => {
        if (!item || typeof item !== 'object') return null;

        const reservation = item as {
          id?: unknown;
          nickname?: unknown;
          headCount?: unknown;
          scheduleId?: unknown;
          status?: unknown;
          createdAt?: unknown;
        };

        const isStatusValid =
          reservation.status === 'pending' ||
          reservation.status === 'confirmed' ||
          reservation.status === 'declined' ||
          reservation.status === 'completed';

        if (
          typeof reservation.id !== 'number' ||
          typeof reservation.nickname !== 'string' ||
          typeof reservation.headCount !== 'number' ||
          typeof reservation.scheduleId !== 'number' ||
          !isStatusValid ||
          typeof reservation.createdAt !== 'string'
        ) {
          return null;
        }

        return {
          id: reservation.id,
          nickname: reservation.nickname,
          headCount: reservation.headCount,
          scheduleId: reservation.scheduleId,
          status: reservation.status,
          createdAt: reservation.createdAt,
        };
      })
      .filter(
        (item): item is ReservationRequestsResponse['reservations'][number] =>
          item !== null
      ),
  };
};

/**
 * 내 체험 예약 상태를 승인/거절로 변경
 */
export const updateActivityReservationStatus = async ({
  activityId,
  reservationId,
  status,
}: UpdateActivityReservationStatusProps): Promise<void> => {
  await fetchInstanceClient(
    `/api/proxy/my-activities/${activityId}/reservations/${reservationId}`,
    {
      method: 'PATCH',
      body: { status },
    }
  );
};

interface CollectPendingReservationIdsForScheduleProps {
  activityId: number;
  scheduleId: number;
  excludeReservationId?: number | null;
}

/**
 * 스케줄 단위로 대기(pending) 예약 id를 커서 페이징으로 모두 수집
 * UI 목록(10건)보다 큰 페이지로 조회해 왕복 횟수를 줄임
 */
export const collectPendingReservationIdsForSchedule = async ({
  activityId,
  scheduleId,
  excludeReservationId = null,
}: CollectPendingReservationIdsForScheduleProps): Promise<number[]> => {
  const ids: number[] = [];
  const visitedCursorIds = new Set<number>();
  let cursorId: number | null = null;

  do {
    const pendingPage = await fetchActivityReservations({
      activityId,
      scheduleId,
      status: 'pending',
      cursorId,
      size: 50,
    });

    pendingPage.reservations.forEach((reservation) => {
      if (
        excludeReservationId !== null &&
        reservation.id === excludeReservationId
      ) {
        return;
      }
      ids.push(reservation.id);
    });

    if (
      pendingPage.cursorId !== null &&
      visitedCursorIds.has(pendingPage.cursorId)
    ) {
      break;
    }
    if (pendingPage.cursorId !== null) {
      visitedCursorIds.add(pendingPage.cursorId);
    }

    cursorId = pendingPage.cursorId;
  } while (cursorId !== null);

  return ids;
};

/**
 * 대기 예약 id 목록 일괄 거절
 * 한 스케줄에 대기 건이 매우 많을 수 있어 전부 병렬로 보내지 않고 5건씩 나눈다.
 * 각 요청의 결과를 수집하고 실패한 예약만 대기 시간을 둔 뒤 다시 시도한다.
 */
const isRetryableDeclineError = (error: unknown) => {
  if (!(error instanceof ApiError)) return true;

  return (
    error.status === 408 ||
    error.status === 425 ||
    error.status === 429 ||
    error.status >= 500
  );
};

export const declinePendingReservationIds = async (
  activityId: number,
  reservationIds: number[],
  {
    maxRetries = DECLINE_PENDING_RESERVATIONS_MAX_RETRIES,
    retryDelayMs = DECLINE_PENDING_RESERVATIONS_RETRY_DELAY_MS,
  }: DeclinePendingReservationIdsOptions = {}
): Promise<DeclinePendingReservationIdsResult> => {
  const uniqueReservationIds = Array.from(new Set(reservationIds));
  const succeededIds = new Set<number>();
  const finalFailures: DeclinePendingReservationFailure[] = [];
  let retryTargets = uniqueReservationIds;
  const normalizedMaxRetries = Math.max(0, Math.floor(maxRetries));
  const normalizedRetryDelayMs = Math.max(0, retryDelayMs);

  for (
    let attempt = 0;
    attempt <= normalizedMaxRetries && retryTargets.length > 0;
    attempt += 1
  ) {
    if (attempt > 0 && normalizedRetryDelayMs > 0) {
      await new Promise((resolve) => {
        setTimeout(resolve, normalizedRetryDelayMs * 2 ** (attempt - 1));
      });
    }

    const nextRetryTargets: number[] = [];

    for (
      let offset = 0;
      offset < retryTargets.length;
      offset += DECLINE_PENDING_RESERVATIONS_CONCURRENCY
    ) {
      const requestGroup = retryTargets.slice(
        offset,
        offset + DECLINE_PENDING_RESERVATIONS_CONCURRENCY
      );
      const results = await Promise.allSettled(
        requestGroup.map((reservationId) =>
          updateActivityReservationStatus({
            activityId,
            reservationId,
            status: 'declined',
          })
        )
      );

      results.forEach((result, index) => {
        const reservationId = requestGroup[index];
        if (reservationId === undefined) return;

        if (result.status === 'fulfilled') {
          succeededIds.add(reservationId);
          return;
        }

        const failure = { reservationId, reason: result.reason };
        const canRetry =
          attempt < normalizedMaxRetries &&
          isRetryableDeclineError(result.reason);

        if (canRetry) {
          nextRetryTargets.push(reservationId);
        } else {
          finalFailures.push(failure);
        }
      });
    }

    retryTargets = nextRetryTargets;
  }

  return {
    succeededIds: uniqueReservationIds.filter((id) => succeededIds.has(id)),
    failed: finalFailures,
  };
};

const emptyDeclineResult = (): DeclinePendingReservationIdsResult => ({
  succeededIds: [],
  failed: [],
});

/**
 * 예약 승인 후 같은 스케줄의 나머지 대기 예약을 조회해 거절한다.
 * 승인이 완료된 뒤의 조회·거절 실패는 결과에 담아 호출부가 부분 성공으로 처리한다.
 */
export const confirmReservationAndDeclinePending = async ({
  activityId,
  reservationId,
  scheduleId,
}: ConfirmReservationAndDeclinePendingProps): Promise<ConfirmReservationAndDeclinePendingResult> => {
  if (scheduleId === null) {
    throw new MissingReservationScheduleError();
  }

  await updateActivityReservationStatus({
    activityId,
    reservationId,
    status: 'confirmed',
  });

  let autoDeclineTargets: number[];

  try {
    autoDeclineTargets = await collectPendingReservationIdsForSchedule({
      activityId,
      scheduleId,
      excludeReservationId: reservationId,
    });
  } catch (error) {
    return {
      confirmedReservationId: reservationId,
      autoDecline: emptyDeclineResult(),
      pendingCollectionError: error,
    };
  }

  const autoDecline = await declinePendingReservationIds(
    activityId,
    autoDeclineTargets
  );

  return {
    confirmedReservationId: reservationId,
    autoDecline,
    pendingCollectionError: null,
  };
};

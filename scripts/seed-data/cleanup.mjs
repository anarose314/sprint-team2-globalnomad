/**
 * seed.mjs 가 생성한 결과 파일(JSON)을 읽어서, 시딩한 예약/체험을 정리(삭제)하는 스크립트.
 *
 * 사용법: node scripts/seed-data/cleanup.mjs scripts/seed-data/output/<파일명>.json
 *
 * 주의:
 * - 예약은 취소(PATCH status: 'canceled') 처리되고, 체험은 실제로 삭제(DELETE)된다.
 * - 백엔드에 회원탈퇴 API가 없어 시딩된 사용자 계정 자체는 삭제되지 않는다.
 *   (email 에 'seed.test' 접두사가 있어 실제 사용자와는 구분 가능)
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { apiRequest } from './config.mjs';

const resultPath = process.argv[2];

if (!resultPath) {
  console.error(
    '사용법: node scripts/seed-data/cleanup.mjs <seed 결과 json 경로>'
  );
  process.exit(1);
}

const result = JSON.parse(readFileSync(path.resolve(resultPath), 'utf-8'));

const login = async (email, password) => {
  const { accessToken } = await apiRequest('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
  return accessToken;
};

const main = async () => {
  console.log(`정리 시작 (prefix: ${result.prefix})`);

  const tokenByEmail = new Map();
  const tokenFor = async (email) => {
    if (!tokenByEmail.has(email)) {
      const user = result.users.find((u) => u.email === email);
      if (!user)
        throw new Error(`결과 파일에서 사용자를 찾을 수 없습니다: ${email}`);
      tokenByEmail.set(email, await login(user.email, user.password));
    }
    return tokenByEmail.get(email);
  };

  console.log('\n[1/2] 예약 취소');
  for (const reservation of result.reservations) {
    try {
      const accessToken = await tokenFor(reservation.guestEmail);
      await apiRequest(`/my-reservations/${reservation.id}`, {
        method: 'PATCH',
        body: { status: 'canceled' },
        accessToken,
      });
      console.log(`  ✓ 예약 취소: #${reservation.id}`);
    } catch (error) {
      console.warn(`  ! 예약 취소 실패: #${reservation.id} (${error.message})`);
    }
  }

  console.log('\n[2/2] 체험 삭제');
  const host = result.users.find((u) => u.role === 'host');
  const hostToken = await tokenFor(host.email);
  for (const activity of result.activities) {
    try {
      await apiRequest(`/my-activities/${activity.id}`, {
        method: 'DELETE',
        accessToken: hostToken,
      });
      console.log(`  ✓ 체험 삭제: #${activity.id}`);
    } catch (error) {
      console.warn(`  ! 체험 삭제 실패: #${activity.id} (${error.message})`);
    }
  }

  console.log(
    `\n완료. 시딩된 사용자 계정(${result.users.length}개)은 백엔드에 탈퇴 API가 없어 그대로 남아있습니다.`
  );
};

main().catch((error) => {
  console.error('\n정리 중 오류 발생:', error.message);
  process.exit(1);
});

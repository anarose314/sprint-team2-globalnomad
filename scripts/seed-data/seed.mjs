/**
 * 테스트용 사용자 + 체험(활동) + 예약 더미 데이터를 실제 백엔드 API에 생성하는 시딩 스크립트.
 *
 * 사용법: node scripts/seed-data/seed.mjs
 * 옵션(환경변수):
 *   SEED_USER_COUNT   생성할 사용자 수 (기본 4, 첫 번째는 호스트, 나머지는 게스트)
 *   SEED_ACTIVITY_COUNT 호스트가 등록할 체험 수 (기본 2)
 *   SEED_PASSWORD     생성할 계정 공통 비밀번호 (기본 'Seed1234!')
 *   SEED_PREFIX       이메일/닉네임 접두사 (기본 'seed<timestamp>') — 실 데이터와 구분하기 위함
 *
 * 이 프로젝트는 자체 DB 없이 공용 백엔드(GlobalNomad API)를 사용하므로,
 * 접두사로 만든 계정임을 항상 구분할 수 있게 하고 과도한 실행은 피할 것.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { apiRequest } from './config.mjs';

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..'
);
const outputDir = path.join(projectRoot, 'scripts/seed-data/output');

const USER_COUNT = Number(process.env.SEED_USER_COUNT ?? 4);
const ACTIVITY_COUNT = Number(process.env.SEED_ACTIVITY_COUNT ?? 2);
const PASSWORD = process.env.SEED_PASSWORD ?? 'Seed1234!';
const PREFIX = process.env.SEED_PREFIX ?? `seed${Date.now()}`;

const CATEGORIES = ['문화 · 예술', '식음료', '스포츠', '투어', '관광', '웰빙'];

if (USER_COUNT < 2) {
  throw new Error(
    'SEED_USER_COUNT 는 최소 2 이상이어야 합니다 (호스트 1 + 게스트 1).'
  );
}

const toDateString = (date) => date.toISOString().slice(0, 10);

const addDays = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const signupAndLogin = async (email, nickname, password) => {
  await apiRequest('/users', {
    method: 'POST',
    body: { email, nickname, password },
  });

  const { user, accessToken } = await apiRequest('/auth/login', {
    method: 'POST',
    body: { email, password },
  });

  return { user, email, password, nickname, accessToken };
};

const createUsers = async () => {
  const users = [];

  for (let i = 1; i <= USER_COUNT; i += 1) {
    const role = i === 1 ? 'host' : 'guest';
    const email = `${PREFIX}.${role}${i}@seed.test`;
    const nickname =
      `${role === 'host' ? '시드호스트' : '시드게스트'}${i}`.slice(0, 10);

    const created = await signupAndLogin(email, nickname, PASSWORD);
    users.push({ ...created, role });
    console.log(`  ✓ 사용자 생성: ${email} (${role})`);
  }

  return users;
};

/**
 * 배너 이미지를 백엔드가 받아들이는 형식(자체 스토리지 URL)으로 만들기 위해,
 * 플레이스홀더 이미지를 내려받아 `/activities/image` 에 업로드하고 그 URL을 반환한다.
 * (임의의 외부 URL은 "배너 이미지 URL 형식이 올바르지 않습니다" 로 거부된다)
 */
const uploadPlaceholderBannerImage = async (accessToken, seed) => {
  const imageResponse = await fetch(
    `https://picsum.photos/seed/${seed}/800/600`
  );
  const imageBlob = await imageResponse.blob();

  const formData = new FormData();
  formData.append('image', imageBlob, `${seed}.jpg`);

  const { activityImageUrl } = await apiRequest('/activities/image', {
    method: 'POST',
    body: formData,
    accessToken,
    isFormData: true,
  });

  return activityImageUrl;
};

const createActivities = async (host) => {
  const activities = [];

  for (let i = 1; i <= ACTIVITY_COUNT; i += 1) {
    const schedules = [
      { date: toDateString(addDays(1)), startTime: '10:00', endTime: '11:00' },
      { date: toDateString(addDays(2)), startTime: '14:00', endTime: '15:00' },
    ];

    const bannerImageUrl = await uploadPlaceholderBannerImage(
      host.accessToken,
      `${PREFIX}-${i}`
    );

    const body = {
      title: `[${PREFIX}] 시드 체험 ${i}`,
      category: CATEGORIES[i % CATEGORIES.length],
      description: '시딩 스크립트로 생성된 테스트용 체험입니다.',
      price: 10000 * i,
      address: '서울특별시 중구 세종대로 110',
      schedules,
      bannerImageUrl,
    };

    const activity = await apiRequest('/activities', {
      method: 'POST',
      body,
      accessToken: host.accessToken,
    });

    activities.push(activity);
    console.log(`  ✓ 체험 생성: #${activity.id} ${activity.title}`);
  }

  return activities;
};

const reserveForGuests = async (activities, guests) => {
  const reservations = [];

  for (const activity of activities) {
    const now = new Date();
    const schedule = await apiRequest(
      `/activities/${activity.id}/available-schedule?year=${now.getFullYear()}&month=${String(
        now.getMonth() + 1
      ).padStart(2, '0')}`
    );

    const firstSlot = schedule.flatMap((day) => day.times)[0];
    if (!firstSlot) {
      console.warn(
        `  ! 체험 #${activity.id} 예약 가능한 시간이 없어 예약을 건너뜁니다.`
      );
      continue;
    }

    for (const guest of guests) {
      try {
        const reservation = await apiRequest(
          `/activities/${activity.id}/reservations`,
          {
            method: 'POST',
            body: { scheduleId: firstSlot.id, headCount: 1 },
            accessToken: guest.accessToken,
          }
        );
        reservations.push({
          ...reservation,
          activityId: activity.id,
          guestEmail: guest.email,
        });
        console.log(
          `  ✓ 예약 생성: 체험 #${activity.id} ← ${guest.email} (reservation #${reservation.id})`
        );
      } catch (error) {
        console.warn(
          `  ! 예약 실패: 체험 #${activity.id} ← ${guest.email} (${error.message})`
        );
      }
    }
  }

  return reservations;
};

const main = async () => {
  console.log(`시딩 시작 (prefix: ${PREFIX})`);

  console.log('\n[1/3] 사용자 생성');
  const users = await createUsers();
  const [host, ...guests] = users;

  console.log('\n[2/3] 체험 생성 (호스트 기준)');
  const activities = await createActivities(host);

  console.log('\n[3/3] 예약 생성 (게스트 기준)');
  const reservations = await reserveForGuests(activities, guests);

  mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, `${PREFIX}.json`);
  writeFileSync(
    outputPath,
    JSON.stringify(
      {
        prefix: PREFIX,
        createdAt: new Date().toISOString(),
        users: users.map(({ user, email, password, nickname, role }) => ({
          id: user.id,
          email,
          password,
          nickname,
          role,
        })),
        activities: activities.map((a) => ({ id: a.id, title: a.title })),
        reservations: reservations.map((r) => ({
          id: r.id,
          activityId: r.activityId,
          guestEmail: r.guestEmail,
        })),
      },
      null,
      2
    )
  );

  console.log(`\n완료. 결과 파일: ${path.relative(projectRoot, outputPath)}`);
  console.log('정리(cleanup)가 필요하면 다음을 실행하세요:');
  console.log(
    `  node scripts/seed-data/cleanup.mjs ${path.relative(projectRoot, outputPath)}`
  );
};

main().catch((error) => {
  console.error('\n시딩 중 오류 발생:', error.message);
  process.exit(1);
});

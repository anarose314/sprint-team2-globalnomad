# 테스트 데이터 시딩 스크립트

실제 운영 화면처럼 테스트/데모를 진행할 수 있도록, 여러 사용자 계정 + 체험(활동) + 예약 더미
데이터를 백엔드 API에 직접 생성하는 스크립트입니다. (관련: #349)

## ⚠️ 주의사항

이 프로젝트는 자체 DB 없이 **공용 백엔드**(`sp-globalnomad-api.vercel.app/22-2`)를 사용합니다.
다른 팀도 같은 서버를 쓸 수 있으므로:

- 생성되는 이메일/닉네임에는 항상 `seed<timestamp>` 접두사가 붙어 실 데이터와 구분됩니다.
- 필요 이상으로 반복 실행하지 마세요.
- 백엔드에 회원탈퇴 API가 없어 **시딩된 사용자 계정 자체는 삭제할 수 없습니다.**
  (체험/예약만 정리 가능)

## 사용법

```bash
# 기본값(사용자 4명: 호스트 1 + 게스트 3, 체험 2개)으로 시딩
node scripts/seed-data/seed.mjs

# 옵션 조정
SEED_USER_COUNT=3 SEED_ACTIVITY_COUNT=1 node scripts/seed-data/seed.mjs
```

실행이 끝나면 `scripts/seed-data/output/<prefix>.json` 에 생성된 사용자(이메일/비밀번호 포함),
체험, 예약 정보가 저장됩니다. 이 파일로 로그인해서 실제 화면을 확인하거나, 정리 스크립트에
넘길 수 있습니다.

```bash
node scripts/seed-data/cleanup.mjs scripts/seed-data/output/<prefix>.json
```

`cleanup.mjs` 는 생성된 예약을 취소하고 체험을 삭제합니다. (사용자 계정은 위 이유로 남습니다)

## 환경변수

| 이름 | 기본값 | 설명 |
|---|---|---|
| `SEED_USER_COUNT` | `4` | 생성할 사용자 수 (최소 2: 호스트 1 + 게스트 1) |
| `SEED_ACTIVITY_COUNT` | `2` | 호스트가 등록할 체험 수 |
| `SEED_PASSWORD` | `Seed1234!` | 생성 계정 공통 비밀번호 |
| `SEED_PREFIX` | `seed<timestamp>` | 이메일/닉네임 접두사 |

`NEXT_PUBLIC_API_BASE_URL` 은 `.env.local` 에서 자동으로 읽어옵니다.

## 출력 파일 (`output/*.json`)

계정 비밀번호가 평문으로 포함되어 있으므로 `.gitignore` 에 의해 커밋되지 않습니다.

<div align="center">
<h1>✈️ GlobalNomad - 일정 관리 대시보드</h1>
<div><img alt="image" src="https://github.com/user-attachments/assets/e4b92fd6-48ba-4e2b-befb-0ff4b770618a" /></div>
<div><img src="https://img.shields.io/badge/period-2026.04.15_~_2026.05.19-88B6E0?style=for-the-badge" /></div>
<p>체험 등록부터 게스트의 예약 및 리뷰까지 지원하는 통합 플랫폼 'GlobalNomad'</p>
<p>
  <a href="https://globalnomad-team2.vercel.app/" target="_blank">🚀 배포 URL</a> | 
  <a href="https://www.youtube.com/watch?v=aixzkIPqnpg" target="_blank">🎬 시연 영상</a> | 
  <a href="https://www.figma.com/deck/poHJ5PVL6c1JrssGyrmqDa" target="_blank">📊 PPT</a>
</p>
</div>

---

## 🗒️ 목차

- [👥 팀원 소개](#-팀원-소개)
- [🗓️ R & R](#️-r--r)
- [🖥️ 화면 미리보기](#%EF%B8%8F-화면-미리보기)
- [🛠️ 기술 스택](#️-기술-스택)
- [🗂️ 프로젝트 구조](#️-프로젝트-구조)

---

### 👥 팀원 소개

<table width="100%">
  <tr>
    <td width="25%" align="center">
      <a href="https://github.com/anarose314" target="_blank">  
        <img src="https://avatars.githubusercontent.com/u/66053969?v=4" width="130px" style="border-radius: 50%;" alt="김예지" />  
      </a>  
    </td>
    <td width="25%" align="center">
      <a href="https://github.com/geniexx64" target="_blank">
        <img src="https://avatars.githubusercontent.com/u/9052086?v=4" width="130px" style="border-radius: 50%;" alt="김현진" />
      </a>
    </td>
    <td width="25%" align="center">
      <a href="https://github.com/YHNeul" target="_blank">
        <img src="https://avatars.githubusercontent.com/u/151646053?v=4" width="130px" style="border-radius: 50%;" alt="양하늘" />
      </a>
    </td>
    <td width="25%" align="center">
      <a href="https://github.com/dltmdall" target="_blank">  
        <img src="https://avatars.githubusercontent.com/u/107185525?v=4" width="130px" style="border-radius: 50%;" alt="이승미" />  
      </a>  
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/anarose314" target="_blank"><b>김예지</b></a>
    </td>
    <td align="center">
      <a href="https://github.com/geniexx64" target="_blank"><b>김현진</b></a>
    </td>
    <td align="center">
      <a href="https://github.com/YHNeul" target="_blank"><b>양하늘</b></a>
    </td>
    <td align="center">
      <a href="https://github.com/dltmdall" target="_blank"><b>이승미</b></a>
    </td>
  </tr>
</table>

---

### 🗓️ R & R

<table width="100%">
  <thead>
    <tr style="background-color: #f6f8fa;">
      <th width="15%" align="center">이름</th>
      <th width="70%" align="left">담당 역할 / 핵심 도메인</th>
      <th width="15%" align="center">세부 내용</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center"><b>김예지</b></td>
      <td align="left">환경 세팅 총괄, 체험 등록 및 수정, 예약 내역 및 내 체험 관리 개발</td>
      <td align="center"><a href="#김예지-상세">보기</a></td>
    </tr>
    <tr>
      <td align="center"><b>김현진</b></td>
      <td align="left">인증 시스템 인프라 구축, 마이페이지 및 사용자 계정 기능 총괄</td>
      <td align="center"><a href="#김현진-상세">보기</a></td>
    </tr>
    <tr>
      <td align="center"><b>양하늘</b></td>
      <td align="left">체험 상세 페이지 구현 및 예약 현황 자동화 로직 설계</td>
      <td align="center"><a href="#양하늘-상세">보기</a></td>
    </tr>
    <tr>
      <td align="center"><b>이승미</b></td>
      <td align="left">공통 레이아웃 및 네비게이션 시스템 구축, 메인 화면 구현</td>
      <td align="center"><a href="#이승미-상세">보기</a></td>
    </tr>
  </tbody>
</table>

<br />

<details id="김예지-상세">
<summary>🔍 김예지 세부 구현 사항 보기</summary>

- **프로젝트 초기 환경 구성:** 
  - `ESLint` / `Prettier` / `Husky` / `Commitlint`
  - `React Query` 및 `Tailwind` 테마 설정
  - 프로젝트 구조 및 `Gemini AI` 코드리뷰 설정
- **공통 UI 및 컴포넌트 개발:**
  - 상태 뱃지 / Toast / Heading / Empty UI
  - Textarea 및 버튼 다형성(`as`) 기능
- **예약 내역 / 내 체험 관리:**
  - 상태별 필터, 후기 작성, 예약 취소
  - 무한 스크롤
- **체험 등록 / 수정:**
  - `react-hook-form` + `zod` 기반 유효성 검사 및 예외 처리
  - 이미지 업로드 및 프리뷰 기능
  - 캘린더 / 다음 우편번호 API 연동
  - 지난 날짜 시간 등록 방지 및 접근 제한 처리
- **사용자 경험(UX) 및 품질 개선:**
  - Dropdown 사용성 개선
  - `proxy route` 작성
  - 버그 수정 및 배포 대응
</details>

<details id="김현진-상세">
<summary>🔍 김현진 세부 구현 사항 보기</summary>

- **공통 UI 및 컴포넌트 개발:**
  - Sidebar / Pagination
  - Header 프로필 Dropdown 메뉴
- **인증 및 사용자 계정:**
  - `react-hook-form` + `zod` 기반 유효성 검사 적용
  - 카카오 간편 로그인 / 회원가입 API 연동
- **인증 및 토큰 관리 시스템:**
  - `BFF` 방식 기반 토큰 저장 구조 설계
  - `fetchInstance` 및 API 환경 구성
  - `refreshToken` 자동 갱신 로직 구현
  - Proxy 기반 보호 라우트 구현
  - `from` 쿼리 파라미터 전달 처리
- **마이페이지 및 정보 관리:**
  - 프로필 이미지 업로드 / 삭제 기능
  - 로그아웃 기능
- **사용자 경험(UX) 및 품질 개선:**
  - 헤더 사용자 정보 실시간 동기화 개선
  - 인증 흐름 및 사용자 상태 관리 리팩토링
</details>

<details id="양하늘-상세">
<summary>🔍 양하늘 세부 구현 사항 보기</summary>

- **공통 UI 및 컴포넌트 개발:**
  - Button / Skeleton
  - 404 / 500 에러 페이지
- **체험 상세 페이지 구현:**
  - 이미지 갤러리 슬라이드
  - 카카오맵 API 연동
  - 예약 가능 날짜 및 오늘 날짜 자동 선택 로직 구현
- **예약 현황 기능 구현:**
  - 캘린더 및 이벤트 뱃지 상태 관리
  - 동시간대 예약 자동 거절 처리
  - 체험 시간 경과 시 자동 상태 변경
- **사용자 경험(UX) 및 품질 개선:**
  - Dropdown / Modal 애니메이션
  - `proxy route` 리팩토링
  - UI 및 상태 처리 버그 수정
</details>

<details id="이승미-상세">
<summary>🔍 이승미 세부 구현 사항 보기</summary>

- **공통 UI 및 컴포넌트 개발:**
  - Input / Dropdown / Modal
- **공통 레이아웃 및 네비게이션:**
  - Header / Footer
  - 로그인 상태 기반 Header 연동
  - 모바일 Side Drawer
- **메인 페이지 기능 구현:**
  - 인기 체험 슬라이드
  - 전체 체험 페이지네이션
  - 검색 및 카테고리 / 정렬 필터 기능
- **사용자 경험(UX) 및 품질 개선:**
  - 전반적인 반응형 UI 및 인터랙션 개선
</details>

---

### 🖥️ 화면 미리보기

> 다양한 디바이스 환경을 고려하여 모든 해상도(PC · Tablet · Mobile)에서 최적화된 UX를 제공합니다.

#### 💡 핵심 기능 미리보기 (GIF)

| 🏠 메인 페이지 | 🔍 체험 상세 페이지 |
| :---: | :---: |
| <img src="https://github.com/user-attachments/assets/d82bde93-3b93-4605-96e7-8de586c037b0" width="100%" alt="메인_GIF" /> | <img src="https://github.com/user-attachments/assets/4ca06617-a945-433d-9990-a5b2835435ee" width="100%" alt="상세_GIF" /> |
| • 검색 및 카테고리별 필터링 기능<br>• 인기 체험 슬라이드 및 전체 체험 페이지네이션 | • 이미지 갤러리 및 카카오맵 API 연동<br>• 후기 조회 및 예약 날짜 선택 |

#### 📸 도메인별 화면 스냅샷 (Image)

| 🔐 로그인 및 회원가입 | 👤 내 정보 관리 |
| :---: | :---: |
| <img src="https://github.com/user-attachments/assets/b6e0f7d8-c7cf-46ee-b113-c4dfb4dcb213" width="100%" alt="로그인_이미지" /> | <img src="https://github.com/user-attachments/assets/2ef75781-9ee1-487a-b093-2c2021b7fd9b" width="100%" alt="내정보_이미지" /> |
| • 실시간 유효성 검사<br>• 카카오 소셜 연동 | • 프로필 이미지 업로드/삭제<br>• 닉네임 / 비밀번호 수정 기능 |

| 📅 예약 내역 | 🛠️ 내 체험 관리 |
| :---: | :---: |
| <img src="https://github.com/user-attachments/assets/56de19ed-9d68-4cbb-b8bf-3f2822c98321" width="100%" alt="예약내역_이미지" /> | <img src="https://github.com/user-attachments/assets/689c7e99-a740-4707-8961-b05e31363c68" width="100%" alt="내체험_이미지" /> |
| • 신청한 체험의 상태별 필터링<br>• 후기 작성 | • 등록한 체험 목록 조회<br>• 수정 및 삭제 기능 |

| 📊 예약 현황 대시보드 | ✍️ 체험 등록 및 수정 |
| :---: | :---: |
| <img src="https://github.com/user-attachments/assets/25cd854c-ef4d-426a-abdc-88c0094e66ee" width="100%" alt="예약현황_이미지" /> | <img src="https://github.com/user-attachments/assets/b6374191-c35f-45b6-8a04-8be7d571b35f" width="100%" alt="체험등록_이미지" /> |
| • 캘린더 대시보드<br>• 예약 승인 및 거절 | • 카카오 우편번호 API 연동<br>• 폼 유효성 검사 및 이미지 프리뷰 |

---

### 🛠️ 기술 스택

#### Framework & Language
<img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white" /> <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" /> <img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" />

#### Styling
<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" />

#### State Management & Data Fetching
<img src="https://img.shields.io/badge/React_Query-FF4154?style=flat-square&logo=ReactQuery&logoColor=white" /> <img src="https://img.shields.io/badge/Zustand-4A3629?style=flat-square" />

#### Form & Validation
<img src="https://img.shields.io/badge/React_Hook_Form-EC5990?style=flat-square&logo=reacthookform&logoColor=white" /> <img src="https://img.shields.io/badge/Zod-3E67B1?style=flat-square&logo=zod&logoColor=white" />

#### Tools & DX
<img src="https://img.shields.io/badge/Storybook-FF4785?style=flat-square&logo=storybook&logoColor=white" /> <img src="https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white" /> <img src="https://img.shields.io/badge/Prettier-F7B93E?style=flat-square&logo=prettier&logoColor=black" /> <img src="https://img.shields.io/badge/Husky-42b983?style=flat-square&logo=git&logoColor=white" />

#### Deployment
<img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white" />

#### Collaboration Tools
<img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white" /> <img src="https://img.shields.io/badge/Discord-5865F2?style=flat-square&logo=discord&logoColor=white" /> <img src="https://img.shields.io/badge/Notion-000000?style=flat-square&logo=notion&logoColor=white" /> <img src="https://img.shields.io/badge/Figma-F24E1E?style=flat-square&logo=figma&logoColor=white" />

---

### 🗂️ 프로젝트 구조

```
📁 public/                               # 정적 파일
📁 src/
├── 📁 app/
│   ├── 🖼️ favicon.ico                   # favicon
│   ├── 📄 error.tsx                     # 페이지별 에러 바운더리
│   ├── 📄 global-error.tsx              # 최상위 전역 에러 바운더리
│   ├── 📄 layout.tsx                    # Root 레이아웃 : HTML, Body
│   ├── 📄 not-found.tsx                 # 존재하지 않는 페이지 (404 화면)
│   ├── 📁 styles/                       # 전역 CSS, Tailwind 설정
│   │
│   ├── 📁 (auth)/                       # 🔑 (인증 라우트 그룹)
│   │   ├── 📁 components/               # 라우트 그룹 전용 컴포넌트
│   │   ├── 📁 login/                    # [로그인] ('/login')
│   │   │   ├── 📄 page.tsx
│   │   │   ├── 📁 components/           # 페이지 전용 컴포넌트
│   │   │   └── 📁 hooks/                # 페이지 전용 훅
│   │   └── 📁 signup/                   # [회원가입] ('/signup')
│   │
│   └── 📁 (main)/                       # 🏠 (메인 라우트 그룹)
│       ├── 📄 layout.tsx                # 공통 레이아웃 : header, footer
│       ├── 📄 page.tsx                  # [메인 화면] ('/')
│       ├── 📁 activity/                 # 🎪 [체험 도메인]
│       │   ├── 📁 [id]/                 # [체험 상세] ('/activity/{id}')
│       │   │   └── 📁 edit/             # [체험 수정] ('/activity/{id}/edit')
│       │   └── 📁 add/                  # [체험 등록] ('/activity/add')
│       └── 📁 my/                       # 👤 [마이페이지 도메인]
│           ├── 📄 layout.tsx            # 마이페이지 공통 레이아웃 : sidebar
│           ├── 📁 profile/              # [내 정보] ('/my/profile')
│           ├── 📁 reservations/         # [예약 내역] ('/my/reservations')
│           ├── 📁 activities/           # [체험 관리] ('/my/activities')
│           └── 📁 activities-dashboard/ # [예약 현황] ('/my/activities-dashboard')
│
└── 📁 shared/                           # 2. 전역 공통 폴더
    ├── 📁 apis/                         # 공통 패치 인스턴스
    ├── 📁 assets/                       # 에셋 폴더
    ├── 📁 components/                   # 전역 공통 UI 컴포넌트
    ├── 📁 constants/                    # 전역 상수 (queryKeys 등)
    ├── 📁 hooks/                        # 전역 훅
    ├── 📁 store/                        # 전역 상태 관리
    ├── 📁 types/                        # 전역 타입
    └── 📁 utils/                        # 전역 유틸
```
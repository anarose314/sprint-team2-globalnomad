import { MyActivitiesResponse } from '@/shared/types/myActivities.types';

// TODO: API 연동 후 더미데이터 삭제
export const DUMMY_ACTIVITES_LIST: MyActivitiesResponse = {
  cursorId: 0,
  totalCount: 6,
  activities: [
    {
      id: 7294,
      userId: 3177,
      title: '티팩토리 성수 갤럭시 마켓 이벤트 팝업~3',
      description: '팝업스토어 방문 및 체험형 이벤트 더미 데이터입니다.',
      category: '이벤트',
      price: 60000,
      address: '서울 성동구 연무장길 95',
      bannerImageUrl:
        'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/globalnomad/activity_registration_image/21-1_3177_1774484126023.jpeg',
      rating: 4.7,
      reviewCount: 203,
      createdAt: '2026-04-28T01:41:38.845Z',
      updatedAt: '2026-04-28T01:41:38.845Z',
    },
    {
      id: 7391,
      userId: 3177,
      title: '일반 테스트입니다',
      description: '기본적인 카드 UI 확인용 액티비티입니다.',
      category: '쿠킹',
      price: 155554,
      address: '서울 강남구 테헤란로 212',
      bannerImageUrl:
        'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/globalnomad/activity_registration_image/21-1_3177_1774596435885.jpeg',
      rating: 4.5,
      reviewCount: 89,
      createdAt: '2026-04-28T01:41:38.845Z',
      updatedAt: '2026-04-28T01:41:38.845Z',
    },
    {
      id: 7460,
      userId: 3229,
      title:
        '111111111111111111111111111111111111111111111111111111111111111111111111111111111111',
      description:
        '긴 제목 테스트용 체험입니다. 실제 API 연동 전 UI 확인을 위한 더미 데이터입니다.',
      category: '문화 · 예술',
      price: 4444,
      address: '서울 성동구 성수이로 123',
      bannerImageUrl:
        'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/globalnomad/activity_registration_image/21-1_3229_1775042497661.png',
      rating: 4.8,
      reviewCount: 128,
      createdAt: '2026-04-28T01:41:38.845Z',
      updatedAt: '2026-04-28T01:41:38.845Z',
    },
    {
      id: 7410,
      userId: 3177,
      title: '이미지테스트',
      description: '배너 이미지 렌더링 확인용 더미 데이터입니다.',
      category: '사진',
      price: 155554,
      address: '서울 마포구 와우산로 94',
      bannerImageUrl:
        'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/globalnomad/activity_registration_image/21-1_3177_1774845166947.jpeg',
      rating: 4.9,
      reviewCount: 57,
      createdAt: '2026-04-28T01:41:38.845Z',
      updatedAt: '2026-04-28T01:41:38.845Z',
    },
    {
      id: 7395,
      userId: 3140,
      title: '테스트 진행 중입니다 수정수정',
      description: '예약 승인 상태 확인을 위한 테스트 액티비티입니다.',
      category: '체험',
      price: 30000,
      address: '경기 성남시 분당구 판교역로 235',
      bannerImageUrl:
        'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/globalnomad/activity_registration_image/21-1_3140_1774656588728.jpeg',
      rating: 3.9,
      reviewCount: 12,
      createdAt: '2026-04-28T01:41:38.845Z',
      updatedAt: '2026-04-28T01:41:38.845Z',
    },
    {
      id: 7411,
      userId: 3177,
      title: 'ㅊㅊㅊㅊㅊ',
      description: '짧은 제목 테스트용 액티비티입니다.',
      category: '관광',
      price: 77777,
      address: '서울 송파구 올림픽로 300',
      bannerImageUrl:
        'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/globalnomad/activity_registration_image/21-1_3177_1774847468204.jpeg',
      rating: 4.2,
      reviewCount: 34,
      createdAt: '2026-04-28T01:41:38.845Z',
      updatedAt: '2026-04-28T01:41:38.845Z',
    },
  ],
};

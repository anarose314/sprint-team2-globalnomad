import { Metadata } from 'next';
import { ActivityFormTitle } from '@/app/(main)/activity/components/activity-form-title';
import { ReserveTimeList } from '@/app/(main)/activity/components/reserve-time-list';
import { Heading } from '@/shared/components/heading';
import { Input } from '@/shared/components/input';

export const metadata: Metadata = {
  title: '내 체험 등록',
};

export default function ActivityAddPage() {
  return (
    <div className="mx-auto mt-7.5 max-w-175 md:mt-10">
      <Heading>내 체험 등록</Heading>
      <form className="mt-6 flex flex-col gap-7.5">
        <section className="flex flex-col gap-6">
          <Input label="제목" placeholder="제목을 입력해 주세요" />
          {/* TODO: 드롭다운 메뉴로 변경 */}
          <Input label="카테고리" placeholder="카테고리를 선택해 주세요" />
          {/* TODO: textarea로 변경 */}
          <Input label="설명" placeholder="체험에 대한 설명을 입력해 주세요" />
          <Input
            label="가격"
            type="number"
            placeholder="체험 금액을 입력해 주세요"
          />
          {/* TODO: 우편번호 서비스 연동 */}
          <Input label="주소" placeholder="주소를 입력해 주세요" />
        </section>
        <section>
          <ActivityFormTitle>예약 가능한 시간대</ActivityFormTitle>
          <ReserveTimeList />
        </section>
        <section>
          <ActivityFormTitle>배너 이미지 등록</ActivityFormTitle>
          {/* TODO: 배너 이미지 등록 추가 */}
        </section>
        <section>
          <ActivityFormTitle>소개 이미지 등록</ActivityFormTitle>
          {/* TODO: 소개 이미지 등록 추가 */}
        </section>
      </form>
      ㄴ{/* TODO: 버튼 추가 */}
    </div>
  );
}

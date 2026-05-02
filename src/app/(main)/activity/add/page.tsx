import { Metadata } from 'next';
import { FormImage } from '@/app/(main)/activity/components/form-image';
import { FormTitle } from '@/app/(main)/activity/components/form-title';
import { ReserveTimeList } from '@/app/(main)/activity/components/reserve-time-list';
import { Heading } from '@/shared/components/heading';
import { Input } from '@/shared/components/input';

export const metadata: Metadata = {
  title: '내 체험 등록',
};

export default function ActivityAddPage() {
  return (
    <div className="mx-auto mt-7.5 mb-9 max-w-175 md:mt-10 md:mb-16 2xl:mb-30">
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
          <FormTitle>예약 가능한 시간대</FormTitle>
          <ReserveTimeList />
        </section>
        <section>
          <FormTitle>배너 이미지 등록</FormTitle>
          <FormImage />
        </section>
        <section>
          <FormTitle>소개 이미지 등록</FormTitle>
          <FormImage isMultiple />
        </section>
      </form>
      {/* TODO: 버튼 추가 */}
    </div>
  );
}

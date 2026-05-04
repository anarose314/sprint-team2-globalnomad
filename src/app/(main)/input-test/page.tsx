import { Input } from '@/shared/components/input';

// TODO: 인풋 컴포넌트와 모달 컴포넌트의 테스트용 임시 페이지로 작업 완료 후 삭제 예정입니다.
export default function Page() {
  return (
    <main className="flex min-h-screen flex-col gap-10 p-10">
      <section className="flex flex-col gap-6">
        <Input label="이메일" placeholder="이메일을 입력해 주세요" />

        <Input label="비밀번호" placeholder="비밀번호를 입력해 주세요" />

        <Input
          label="닉네임"
          placeholder="닉네임을 입력해 주세요"
          errorMessage="닉네임은 10자 이하로 입력해 주세요."
        />
      </section>
    </main>
  );
}

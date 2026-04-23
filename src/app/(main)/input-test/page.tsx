import { Input } from '@/shared/components/input';

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col gap-6 p-10">
      <Input label="이메일" placeholder="이메일을 입력해 주세요" />

      <Input label="비밀번호" placeholder="비밀번호를 입력해 주세요" />

      <Input
        label="닉네임"
        placeholder="닉네임을 입력해 주세요"
        errorMessage="닉네임은 10자 이하로 입력해 주세요."
      />
    </div>
  );
}

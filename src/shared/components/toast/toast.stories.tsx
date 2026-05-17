import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Toast } from '@/shared/components/toast';

const meta: Meta<typeof Toast> = {
  title: 'Shared/Toast',
  component: Toast,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    theme: {
      control: 'radio',
      options: ['success', 'error', 'warning', 'info'],
      description: '토스트 테마 (아이콘 및 색상 변경)',
    },
    title: {
      control: 'text',
      description: '타이틀 (생략 시 테마별 기본값 출력)',
    },
    message: {
      control: 'text',
      description: '하단 상세 메시지',
    },
    isDisableTitle: {
      control: 'boolean',
      description: '타이틀 숨김 여부 (메시지만 띄울 때 사용)',
    },
    onClose: {
      action: 'closed',
      description: '닫기 버튼 클릭 또는 타이머 종료 시 실행되는 함수',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toast>;

/** * 기본 성공 토스트
 */
export const Success: Story = {
  args: {
    id: 'toast-success-1',
    theme: 'success',
    message: '성공적으로 저장되었습니다.',
  },
};

/** * 기본 에러 토스트
 */
export const Error: Story = {
  args: {
    id: 'toast-error-1',
    theme: 'error',
    message: '데이터를 불러오는 데 실패했습니다.',
  },
};

/** * 기본 경고 토스트
 */
export const Warning: Story = {
  args: {
    id: 'toast-warning-1',
    theme: 'warning',
    message: '삭제된 데이터는 복구할 수 없습니다.',
  },
};

/** * 기본 정보 토스트
 */
export const Info: Story = {
  args: {
    id: 'toast-info-1',
    theme: 'info',
    message: '새로운 예약 알림이 도착했습니다.',
  },
};

/** * 타이틀을 직접 커스텀한 토스트
 */
export const CustomTitle: Story = {
  args: {
    id: 'toast-custom-1',
    theme: 'success',
    title: '예약 완료! 🎉',
    message: '마이페이지에서 예약 내역을 확인해 주세요.',
  },
};

/** * 타이틀 없이 메시지만 띄우는 토스트
 */
export const NoTitle: Story = {
  args: {
    id: 'toast-notitle-1',
    theme: 'error',
    isDisableTitle: true,
    message: '타이틀 없이 메시지만 띄울 수도 있습니다.',
  },
};

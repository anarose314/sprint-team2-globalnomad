import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Skeleton } from '@/shared/components/skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Shared/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['pulse', 'shimmer', 'none'],
      description: '애니메이션 종류',
      table: {
        defaultValue: { summary: 'pulse' },
      },
    },
    rounded: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
      description: '모서리 둥글기',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    width: {
      control: 'text',
      description: '너비 (숫자: px, 문자열: CSS 값)',
    },
    height: {
      control: 'text',
      description: '높이 (숫자: px, 문자열: CSS 값)',
    },
    className: {
      control: 'text',
      description: '추가 커스텀 클래스',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

/** 기본 텍스트 줄 스켈레톤 (pulse 애니메이션) */
export const Default: Story = {
  args: {
    width: 240,
    height: 20,
  },
};

/** shimmer 슬라이딩 애니메이션 */
export const Shimmer: Story = {
  args: {
    width: '233',
    height: '233',
    variant: 'shimmer',
    rounded: 'sm',
  },
};

/** 애니메이션 없음 */
export const NoAnimation: Story = {
  args: {
    width: 240,
    height: 20,
    variant: 'none',
  },
};

/** 원형 아바타 스켈레톤 */
export const Circle: Story = {
  args: {
    width: '500px',
    height: 48,
    rounded: 'full',
    variant: 'pulse',
  },
};

/** 이미지 영역 스켈레톤 */
export const ImageBlock: Story = {
  args: {
    width: 320,
    height: 200,
    rounded: 'xl',
    variant: 'shimmer',
  },
};

/** 버튼 형태 스켈레톤 */
export const Button: Story = {
  args: {
    width: 120,
    height: 44,
    rounded: 'lg',
  },
};

/** 체험 카드 스켈레톤 */
export const ActivityCard: Story = {
  render: () => (
    <div className="shadow-card w-72 overflow-hidden rounded-xl">
      <Skeleton
        height={168}
        className="w-full"
        rounded="none"
        variant="shimmer"
      />
      <div className="flex flex-col gap-2 p-4">
        <Skeleton height={20} className="w-4/5" />
        <Skeleton height={16} className="w-1/2" />
        <div className="mt-2 flex items-center justify-between">
          <Skeleton width={80} height={22} rounded="full" />
          <Skeleton width={60} height={18} />
        </div>
      </div>
    </div>
  ),
};

/** 리스트 아이템 스켈레톤 */
export const ListItem: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton width={48} height={48} rounded="full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton height={16} className="w-3/4" />
            <Skeleton height={14} className="w-1/2" />
          </div>
        </div>
      ))}
    </div>
  ),
};

/** 예약 내역 카드 스켈레톤 */
export const ReservationCard: Story = {
  render: () => (
    <div className="shadow-card flex w-96 gap-4 rounded-xl p-4">
      <Skeleton width={120} height={120} rounded="xl" variant="shimmer" />
      <div className="flex flex-1 flex-col justify-between py-1">
        <div className="flex flex-col gap-2">
          <Skeleton height={14} className="w-1/3" />
          <Skeleton height={20} className="w-4/5" />
          <Skeleton height={16} className="w-3/5" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton width={70} height={22} rounded="full" />
          <Skeleton width={90} height={18} />
        </div>
      </div>
    </div>
  ),
};

/** 프로필 섹션 스켈레톤 */
export const ProfileSection: Story = {
  render: () => (
    <div className="flex w-80 flex-col items-center gap-4 p-6">
      <Skeleton width={80} height={80} rounded="full" variant="shimmer" />
      <div className="flex w-full flex-col items-center gap-2">
        <Skeleton height={22} className="w-1/3" />
        <Skeleton height={16} className="w-2/3" />
      </div>
      <div className="flex w-full flex-col gap-3 pt-2">
        <Skeleton height={48} className="w-full" rounded="lg" />
        <Skeleton height={48} className="w-full" rounded="lg" />
      </div>
    </div>
  ),
};

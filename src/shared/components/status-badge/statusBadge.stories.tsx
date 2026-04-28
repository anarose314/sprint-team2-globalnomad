import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { StatusBadge } from '@/shared/components/status-badge';

const meta: Meta<typeof StatusBadge> = {
  title: 'Shared/StatusBadge',
  component: StatusBadge,
  parameters: {
    layout: 'centered',
  },
  args: {
    status: 'completed',
  },
};

export default meta;
type Story = StoryObj<typeof StatusBadge>;

export const Completed: Story = {};

export const Cancelled: Story = {
  args: {
    status: 'cancelled',
  },
};

export const Rejected: Story = {
  args: {
    status: 'rejected',
  },
};

export const Attended: Story = {
  args: {
    status: 'attended',
  },
};

export const Approved: Story = {
  args: {
    status: 'approved',
  },
};

export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <StatusBadge status="completed" />
      <StatusBadge status="cancelled" />
      <StatusBadge status="rejected" />
      <StatusBadge status="attended" />
      <StatusBadge status="approved" />
    </div>
  ),
};

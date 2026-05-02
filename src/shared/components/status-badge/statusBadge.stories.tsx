import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { StatusBadge } from '@/shared/components/status-badge';

const meta: Meta<typeof StatusBadge> = {
  title: 'Shared/StatusBadge',
  component: StatusBadge,
  parameters: {
    layout: 'centered',
  },
  args: {
    status: 'pending',
  },
};

export default meta;
type Story = StoryObj<typeof StatusBadge>;

export const Pending: Story = {};

export const Canceled: Story = {
  args: {
    status: 'canceled',
  },
};

export const Declined: Story = {
  args: {
    status: 'declined',
  },
};

export const Completed: Story = {
  args: {
    status: 'completed',
  },
};

export const Confirmed: Story = {
  args: {
    status: 'confirmed',
  },
};

export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <StatusBadge status="completed" />
      <StatusBadge status="canceled" />
      <StatusBadge status="declined" />
      <StatusBadge status="completed" />
      <StatusBadge status="confirmed" />
    </div>
  ),
};

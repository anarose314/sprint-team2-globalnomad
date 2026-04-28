import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FilterButton } from '@/shared/components/buttons/filter-button';

const meta: Meta<typeof FilterButton> = {
  title: 'Shared/Buttons/FilterButton',
  component: FilterButton,
  parameters: {
    layout: 'centered',
  },
  args: {
    label: '아트',
    category: 'art',
    state: 'normal',
    showIcon: true,
  },
};

export default meta;
type Story = StoryObj<typeof FilterButton>;

export const Default: Story = {};

export const Active: Story = {
  args: {
    state: 'active',
  },
};

export const NoIcon: Story = {
  args: {
    label: '전체',
    showIcon: false,
    category: undefined,
  },
};

export const Categories: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <FilterButton label="아트" category="art" />
      <FilterButton label="음식" category="food" />
      <FilterButton label="버스" category="bus" />
      <FilterButton label="스포츠" category="sport" />
      <FilterButton label="투어" category="tour" />
      <FilterButton label="웰빙" category="wellbeing" />
    </div>
  ),
};

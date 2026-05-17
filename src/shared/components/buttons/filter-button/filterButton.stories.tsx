import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  IcArt,
  IcBus,
  IcFood,
  IcSport,
  IcTour,
  IcWellbeing,
} from '@/shared/assets/icons';
import { FilterButton } from '@/shared/components/buttons/filter-button';

const meta: Meta<typeof FilterButton> = {
  title: 'Shared/Buttons/FilterButton',
  component: FilterButton,
  parameters: {
    layout: 'centered',
  },
  args: {
    label: '문화 · 예술',
    icon: <IcArt />,
    state: 'normal',
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
    icon: undefined,
  },
};

export const categories: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <FilterButton label="문화 · 예술" icon={<IcArt />} />
      <FilterButton label="식음료" icon={<IcFood />} />
      <FilterButton label="관광" icon={<IcBus />} />
      <FilterButton label="스포츠" icon={<IcSport />} />
      <FilterButton label="투어" icon={<IcTour />} />
      <FilterButton label="웰빙" icon={<IcWellbeing />} />
    </div>
  ),
};

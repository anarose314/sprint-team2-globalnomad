import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { IcArrowLeft, IcArrowRight, IcEdit } from '@/shared/assets/icons';
import { Button } from '@/shared/components/buttons/button';

const iconOptions = {
  none: undefined,
  arrowRight: <IcArrowRight />,
  arrowLeft: <IcArrowLeft />,
  edit: <IcEdit />,
};

const meta: Meta<typeof Button> = {
  title: 'Shared/Buttons/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  args: {
    children: '날짜 선택하기',
    size: 'lg',
    variant: 'primary',
  },
  argTypes: {
    icon: {
      options: Object.keys(iconOptions),
      mapping: iconOptions,
      control: { type: 'select' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: '취소',
  },
};

export const WithIcon: Story = {
  args: {
    variant: 'secondary',
    size: 'lg',
    icon: 'arrowRight',
    children: '수정하기',
  },
};

export const SecondarySelected: Story = {
  args: {
    variant: 'secondary',
    size: 'lg',
    icon: 'arrowRight',
    children: '수정하기',
    'aria-pressed': true,
  },
};

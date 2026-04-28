import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { IcArrowLeft, IcArrowRight, IcEdit } from '@/shared/assets/icons';
import { Button } from '@/shared/components/buttons/button';

const ICON_OPTIONS = {
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
      options: Object.keys(ICON_OPTIONS),
      mapping: ICON_OPTIONS,
      control: { type: 'select' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const defaultButton: Story = {};

export const secondaryButton: Story = {
  args: {
    variant: 'secondary',
    children: '취소',
  },
};

export const withIconButton: Story = {
  args: {
    variant: 'secondary',
    size: 'lg',
    icon: 'arrowRight',
    children: '수정하기',
  },
};

export const secondarySelected: Story = {
  args: {
    variant: 'secondary',
    size: 'lg',
    icon: 'arrowRight',
    children: '수정하기',
    'aria-pressed': true,
  },
};

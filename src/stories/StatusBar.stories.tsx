import type { Meta, StoryObj } from '@storybook/react';
import { StatusBar } from 'ece-docs-components';

const meta = {
  title: 'Components/StatusBar',
  component: StatusBar,
  argTypes: {
    variant: {
      control: 'select',
      options: ['actionstarted', 'noaction'],
    },
    itemCount: { control: 'number' },
    onTailorClick: { action: 'tailorClicked' },
    onNextClick: { action: 'nextClicked' },
  },
} satisfies Meta<typeof StatusBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    itemCount: 3,
    variant: 'actionstarted',
    onNextClick: () => {},
  },
};

export const NotStarted: Story = {
  args: {
    itemCount: 5,
    variant: 'noaction',
    onTailorClick: () => {},
  },
};

export const ActionStarted: Story = {
  args: {
    itemCount: 12,
    variant: 'actionstarted',
    onNextClick: () => {},
  },
};

export const ZeroItems: Story = {
  args: {
    itemCount: 0,
    variant: 'noaction',
    onTailorClick: () => {},
  },
};
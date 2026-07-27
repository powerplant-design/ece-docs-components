import type { Meta, StoryObj } from '@storybook/react';
import { SearchRounded, HomeRounded } from '@mui/icons-material';
import { ActionButton } from 'ece-docs-components';

const meta = {
  title: 'Components/ActionButton',
  component: ActionButton,
  argTypes: {
    label: { control: 'text' },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof ActionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: SearchRounded,
    label: 'Search',
    onClick: () => {},
  },
};

export const Home: Story = {
  args: {
    icon: HomeRounded,
    label: 'Home',
    onClick: () => {},
  },
};

export const NoLabel: Story = {
  args: {
    icon: SearchRounded,
    onClick: () => {},
  },
};
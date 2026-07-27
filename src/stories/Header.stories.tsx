import type { Meta, StoryObj } from '@storybook/react';
import { Header } from 'ece-docs-components';

const meta = {
  title: 'Components/Header',
  component: Header,
  argTypes: {
    userName: { control: 'text' },
    userInitials: { control: 'text' },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { userName: 'John Doe', userInitials: 'JD' },
};

export const LongName: Story = {
  args: {
    userName: 'Alexandra Penelope Wellington',
    userInitials: 'AP',
  },
};

export const ShortName: Story = {
  args: { userName: 'Bo', userInitials: 'B' },
};
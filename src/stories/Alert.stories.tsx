import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from 'ece-docs-components';

const meta = {
  title: 'Components/Alert',
  component: Alert,
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error', 'custom'],
    },
    icon: { control: 'boolean' },
    children: { control: 'text' },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { variant: 'info', children: 'This is an informational alert.' },
};

export const Info: Story = {
  args: { variant: 'info', children: 'Informational message.' },
};

export const Success: Story = {
  args: { variant: 'success', children: 'Action completed successfully.' },
};

export const Warning: Story = {
  args: { variant: 'warning', children: 'Be careful with this action.' },
};

export const Error: Story = {
  args: { variant: 'error', children: 'Something went wrong.' },
};

export const Custom: Story = {
  args: { variant: 'custom', children: 'A custom themed alert.' },
};

export const NoIcon: Story = {
  args: { variant: 'info', icon: false, children: 'Alert without an icon.' },
};

export const LongText: Story = {
  args: {
    variant: 'warning',
    children:
      'This is a very long alert message that wraps across multiple lines to test how the layout handles extended content while still maintaining alignment and readability of the message text.',
  },
};
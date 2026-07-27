import type { Meta, StoryObj } from '@storybook/react';
import { Input } from 'ece-docs-components';

const meta = {
  title: 'Components/Input',
  component: Input,
  argTypes: {
    label: { control: 'text' },
    error: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Centre name', placeholder: 'Enter centre name' },
};

export const WithoutLabel: Story = {
  args: { placeholder: 'No label here' },
};

export const WithError: Story = {
  args: {
    label: 'Email address',
    placeholder: 'you@example.com',
    error: 'Please enter a valid email address.',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Read-only field',
    placeholder: 'Cannot edit',
    disabled: true,
  },
};

export const FullWidth: Story = {
  args: {
    label: 'Full width input',
    placeholder: 'Stretches to container',
    fullWidth: true,
  },
};
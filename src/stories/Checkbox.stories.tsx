import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from 'ece-docs-components';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    disabled: { control: 'boolean' },
    checked: { control: 'boolean' },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Accept terms and conditions' },
};

export const WithDescription: Story = {
  args: {
    label: 'Subscribe to newsletter',
    description: 'Receive occasional updates about new features.',
  },
};

export const Checked: Story = {
  args: { label: 'Pre-checked option', checked: true },
};

export const Disabled: Story = {
  args: { label: 'Disabled option', disabled: true },
};

export const CheckedDisabled: Story = {
  args: { label: 'Checked and disabled', checked: true, disabled: true },
};
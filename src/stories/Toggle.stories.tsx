import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Toggle } from 'ece-docs-components';

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  argTypes: {
    label: { control: 'text' },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

const ToggleWrapper: React.FC<{ label?: string; initialChecked?: boolean }> = ({
  label,
  initialChecked = false,
}) => {
  const [checked, setChecked] = useState(initialChecked);
  return <Toggle label={label} checked={checked} onChange={setChecked} />;
};

export const Default: Story = {
  render: () => <ToggleWrapper label="Admin view" />,
};

export const Checked: Story = {
  render: () => <ToggleWrapper label="Receive notifications" initialChecked />,
};

export const CustomLabel: Story = {
  render: () => <ToggleWrapper label="Enable two-factor authentication" />,
};
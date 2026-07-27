import type { Meta, StoryObj } from '@storybook/react';
import { Card } from 'ece-docs-components';

const meta = {
  title: 'Components/Card',
  component: Card,
  argTypes: {
    padding: { control: 'select', options: ['none', 'sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['default', 'bordered', 'elevated'] },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
    padding: 'md',
    children: 'This is a card with default styling and medium padding.',
  },
};

export const Bordered: Story = {
  args: {
    variant: 'bordered',
    padding: 'md',
    children: 'A bordered card.',
  },
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    padding: 'md',
    children: 'An elevated card with shadow.',
  },
};

export const NoPadding: Story = {
  args: {
    variant: 'default',
    padding: 'none',
    children: 'A card without internal padding.',
  },
};

export const LargePadding: Story = {
  args: {
    variant: 'default',
    padding: 'lg',
    children: 'A card with large padding.',
  },
};
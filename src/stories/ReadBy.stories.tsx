import type { Meta, StoryObj } from '@storybook/react';
import { ReadBy } from 'ece-docs-components';

const meta = {
  title: 'Components/ReadBy',
  component: ReadBy,
} satisfies Meta<typeof ReadBy>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { names: ['Jane Doe', 'John Smith', 'Aroha Ngata'] },
};

export const SingleName: Story = {
  args: { names: ['Jane Doe'] },
};

export const ManyNames: Story = {
  args: {
    names: [
      'Jane Doe',
      'John Smith',
      'Aroha Ngata',
      'Hone Wairere',
      'Mereana Tangaroa',
      'Tama Rivera',
      'Priya Patel',
      'Wei Zhang',
    ],
  },
};
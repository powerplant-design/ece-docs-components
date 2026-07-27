import type { Meta, StoryObj } from '@storybook/react';
import { ExpandingBox } from 'ece-docs-components';

const meta = {
  title: 'Components/ExpandingBox',
  component: ExpandingBox,
} satisfies Meta<typeof ExpandingBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    open: true,
    content: 'Additional detail shown when the toggle is expanded.',
  },
};

export const Closed: Story = {
  args: {
    open: false,
    content: 'This content is hidden when collapsed.',
  },
};
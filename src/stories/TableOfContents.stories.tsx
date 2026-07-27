import type { Meta, StoryObj } from '@storybook/react';
import { TableOfContents } from 'ece-docs-components';

const meta = {
  title: 'Components/TableOfContents',
  component: TableOfContents,
  argTypes: {
    activeSection: { control: 'text' },
  },
} satisfies Meta<typeof TableOfContents>;

export default meta;
type Story = StoryObj<typeof meta>;

const sections = [
  { id: 'introduction', title: 'Introduction' },
  { id: 'philosophy', title: 'Philosophy and Values' },
  { id: 'te-tiriti', title: 'Te Tiriti o Waitangi' },
  { id: 'review', title: 'Self-Review and Internal Evaluation' },
];

export const Default: Story = {
  args: { sections, activeSection: 'philosophy' },
};

export const NoActive: Story = {
  args: { sections, activeSection: 'introduction' },
};

export const SingleSection: Story = {
  args: {
    sections: [{ id: 'only', title: 'Only Section' }],
    activeSection: 'only',
  },
};
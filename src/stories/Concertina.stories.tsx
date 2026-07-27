import type { Meta, StoryObj } from '@storybook/react';
import { Concertina } from 'ece-docs-components';

const meta = {
  title: 'Components/Concertina',
  component: Concertina,
} satisfies Meta<typeof Concertina>;

export default meta;
type Story = StoryObj<typeof meta>;

const sections = [
  {
    id: 'section-1',
    title: 'Philosophy and Values',
    content: 'Our philosophy is rooted in respect for children and their whānau.',
  },
  {
    id: 'section-2',
    title: 'Te Tiriti o Waitangi',
    content: 'We honour our commitments under Te Tiriti o Waitangi.',
  },
  {
    id: 'section-3',
    title: 'Self-Review and Internal Evaluation',
    content: 'Continuous improvement through systematic internal evaluation.',
  },
];

export const Default: Story = {
  args: { sections },
};

export const SingleSection: Story = {
  args: {
    sections: [
      {
        id: 'only',
        title: 'Only Section',
        content: 'A lone accordion section.',
      },
    ],
  },
};

export const LongContent: Story = {
  args: {
    sections: [
      {
        id: 'long',
        title: 'Long Content Section',
        content:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      },
    ],
  },
};
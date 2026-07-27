import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { ExpandingBox, ExpandingBoxToggle } from 'ece-docs-components';

const meta = {
  title: 'Components/ExpandingBoxToggle',
  component: ExpandingBoxToggle,
} satisfies Meta<typeof ExpandingBoxToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

const ToggleShowcase: React.FC<{ term: string; initialOpen?: boolean; content: string }> = ({
  term,
  initialOpen = false,
  content,
}) => {
  const [open, setOpen] = useState(initialOpen);
  return (
    <div>
      <ExpandingBoxToggle term={term} open={open} setOpen={setOpen} />
      <ExpandingBox open={open} content={content} />
    </div>
  );
};

export const Default: Story = {
  render: () => (
    <ToggleShowcase
      term="Philosophy and Values"
      content="Our philosophy is rooted in respect for children and their whānau."
    />
  ),
};

export const StartsOpen: Story = {
  render: () => (
    <ToggleShowcase
      term="Te Tiriti o Waitangi"
      initialOpen
      content="We honour our commitments under Te Tiriti o Waitangi."
    />
  ),
};
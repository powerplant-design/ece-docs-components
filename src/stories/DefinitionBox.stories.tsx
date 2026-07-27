import type { Meta, StoryObj } from '@storybook/react';
import { DefinitionBox } from 'ece-docs-components';

const meta = {
  title: 'Components/DefinitionBox',
  component: DefinitionBox,
  argTypes: {
    term: { control: 'text' },
    definition: { control: 'text' },
  },
} satisfies Meta<typeof DefinitionBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    term: 'whānau',
    definition: 'Extended family, family group; a primary social unit in Mā society.',
    children: 'Strong relationships with ',
  },
};

export const InlineText: Story = {
  args: {
    term: 'Te Tiriti',
    definition: 'The Treaty of Waitangi, signed in 1840 between the British Crown and Māori chiefs.',
    children: 'Our commitments under ',
  },
};

export const LongDefinition: Story = {
  args: {
    term: 'curriculum',
    definition:
      'The planned programme of teaching and learning experiences that scaffold children\u2019s development, framed by Te Whāriki and tailored to the local context and the interests of the children.',
    children: 'A rich ',
  },
};
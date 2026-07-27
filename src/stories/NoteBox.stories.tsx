import type { Meta, StoryObj } from '@storybook/react';
import { NoteBox } from 'ece-docs-components';

const meta = {
  title: 'Components/NoteBox',
  component: NoteBox,
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'mandatory',
        'optional',
        'pending',
        'accepted',
        'action-required',
        'custom',
      ],
    },
    label: { control: 'text' },
  },
} satisfies Meta<typeof NoteBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { variant: 'default', children: 'Highlighted text within a policy.' },
};

export const Mandatory: Story = {
  args: { variant: 'mandatory', children: 'This question has not been answered.' },
};

export const Optional: Story = {
  args: { variant: 'optional', children: 'Optional highlighted wording.' },
};

export const Pending: Story = {
  args: { variant: 'pending', children: 'Awaiting reviewer feedback.' },
};

export const Accepted: Story = {
  args: { variant: 'accepted', children: 'This wording has been accepted.' },
};

export const ActionRequired: Story = {
  args: { variant: 'action-required', children: 'Changes required before approval.' },
};

export const Custom: Story = {
  args: { variant: 'custom', label: 'Custom Label', children: 'A custom-styled highlight.' },
};

export const WithEditClick: Story = {
  args: {
    variant: 'default',
    children: 'Click the edit button to change this highlight.',
    onEditClick: () => {},
  },
};
import type { Meta, StoryObj } from '@storybook/react';
import { NoteBox } from 'ece-docs-components';

const meta = {
  title: 'Components/NoteBox',
  component: NoteBox,
  argTypes: {
    status: {
      control: 'select',
      options: ['Accepted', 'Pending', 'Action Required', 'Declined', 'Not Started', 'Rejected'],
    },
    requirementType: {
      control: 'select',
      options: ['Default', 'Optional'],
    },
    label: { control: 'text' },
    note: { control: 'text' },
    onEditClick: { action: 'editClicked' },
  },
} satisfies Meta<typeof NoteBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { status: 'Pending', label: 'Note', children: 'Highlighted text within a policy.' },
};

export const Mandatory: Story = {
  args: {
    status: 'Not Started',
    requirementType: 'Default',
    children: 'This question has not been answered.',
  },
};

export const Optional: Story = {
  args: {
    status: 'Pending',
    requirementType: 'Optional',
    children: 'Optional highlighted wording.',
  },
};

export const Accepted: Story = {
  args: { status: 'Accepted', children: 'This wording has been accepted.' },
};

export const ActionRequired: Story = {
  args: {
    status: 'Action Required',
    note: 'A reviewer has requested changes to this wording.',
    children: 'Changes required before approval.',
  },
};

export const WithEditClick: Story = {
  args: {
    status: 'Pending',
    children: 'Click the edit button to change this highlight.',
    onEditClick: () => {},
  },
};
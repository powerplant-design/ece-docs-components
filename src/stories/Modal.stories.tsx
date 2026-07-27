import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Button } from 'ece-docs-components';
import { Modal, ModalProps } from 'ece-docs-components';

const meta = {
  title: 'Components/Modal',
  component: Modal,
  argTypes: {
    status: {
      control: 'select',
      options: [
        'mandatory',
        'optional',
        'accepted',
        'action-required',
        'action-required-note',
        'accepted-note',
      ],
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

const ModalWrapper: React.FC<{
  status: ModalProps['status'];
  note?: string;
}> = ({ status, note }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        Open Modal
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        status={status}
        description="Please review and respond to the suggested wording for this policy section."
        defaultText="Suggested wording goes here."
        note={note}
        onSave={() => {}}
        onSubmit={() => {}}
        onDeclineWording={() => {}}
        onPrevious={() => {}}
        onNext={() => {}}
        currentPage={1}
        totalPages={3}
      />
    </>
  );
};

export const Mandatory: Story = {
  render: (args) => <ModalWrapper status="mandatory" />,
};

export const Optional: Story = {
  render: (args) => <ModalWrapper status="optional" />,
};

export const Accepted: Story = {
  render: (args) => <ModalWrapper status="accepted" />,
};

export const ActionRequired: Story = {
  render: (args) => <ModalWrapper status="action-required" />,
};

export const ActionRequiredNote: Story = {
  render: (args) => (
    <ModalWrapper status="action-required-note" note="A reviewer has requested changes to this wording." />
  ),
};

export const AcceptedNote: Story = {
  render: (args) => (
    <ModalWrapper status="accepted-note" note="This wording was accepted and locked for review." />
  ),
};
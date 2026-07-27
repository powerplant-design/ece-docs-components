import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Button, Modal } from 'ece-docs-components';

const meta = {
  title: 'Components/Modal',
  component: Modal,
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleVariable = {
  _id: 'var-1',
  name: 'Centre name',
  value: 'Sample policy wording for the centre.',
  defaultValue: 'Default suggested wording.',
  pluralValue: 'Sample policy wordings for the centre.',
  validFrom: new Date(),
  customerHelpText: 'Help text for customers.',
  writerHelpText: 'Help text for writers.',
  state: 'Accepted',
  hidden: false,
  canBeBlank: false,
  vertical: 'ECE',
  requirementType: 'Default',
};

const ModalWrapper: React.FC<{ state?: string; isLoading?: boolean }> = ({
  state = 'Accepted',
  isLoading = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        Open Modal
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={() => {}}
        onSubmit={() => {}}
        onDeclineWording={() => {}}
        onPrevious={() => {}}
        onNext={() => {}}
        currentPage={1}
        totalPages={3}
        isLoading={isLoading}
        variable={{ ...sampleVariable, state } as any}
        isLeafOrganisation={true}
      />
    </>
  );
};

export const Default: Story = {
  render: () => <ModalWrapper />,
};

export const Pending: Story = {
  render: () => <ModalWrapper state="Pending" />,
};

export const ActionRequired: Story = {
  render: () => <ModalWrapper state="Action Required" />,
};

export const Declined: Story = {
  render: () => <ModalWrapper state="Declined" />,
};

export const NotStarted: Story = {
  render: () => <ModalWrapper state="Not Started" />,
};

export const Loading: Story = {
  render: () => <ModalWrapper state="Accepted" isLoading />,
};
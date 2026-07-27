import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Button, SimpleModal } from 'ece-docs-components';

const meta = {
  title: 'Components/SimpleModal',
  component: SimpleModal,
  argTypes: {
    title: { control: 'text' },
  },
} satisfies Meta<typeof SimpleModal>;

export default meta;
type Story = StoryObj<typeof meta>;

const SimpleModalWrapper: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        Open Modal
      </Button>
      <SimpleModal isOpen={isOpen} onClose={() => setIsOpen(false)} title={title}>
        {children}
      </SimpleModal>
    </>
  );
};

export const Default: Story = {
  render: () => (
    <SimpleModalWrapper title="Confirm action">
      <p>Are you sure you want to proceed with this action?</p>
    </SimpleModalWrapper>
  ),
};

export const LongContent: Story = {
  render: () => (
    <SimpleModalWrapper title="Policy review notes">
      <p>
        This modal contains a longer body of text to verify how the dialog handles
        extended content and wraps text within the constrained width.
      </p>
    </SimpleModalWrapper>
  ),
};
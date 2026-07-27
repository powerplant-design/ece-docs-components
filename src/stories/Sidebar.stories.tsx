import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Sidebar } from 'ece-docs-components';

const meta = {
  title: 'Components/Sidebar',
  component: Sidebar,
  argTypes: {
    centreName: { control: 'text' },
    activePage: { control: 'text' },
    onPageChange: { action: 'pageChanged' },
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

const SidebarWrapper: React.FC<Partial<React.ComponentProps<typeof Sidebar>>> = (props) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Sidebar
      isOpen={isOpen}
      onToggle={() => setIsOpen((v) => !v)}
      centreName="Happy Kids Early Learning Centre"
      activePage="policies"
      onPageChange={() => {}}
      {...props}
    />
  );
};

export const Default: Story = {
  render: () => <SidebarWrapper />,
};

// Force the collapsed view via a wrapper that starts closed.
const CollapsedWrapper: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Sidebar
      isOpen={isOpen}
      onToggle={() => setIsOpen((v) => !v)}
      centreName="Happy Kids Early Learning Centre"
      activePage="dashboard"
      onPageChange={() => {}}
    />
  );
};

export const CollapsedInitial: Story = {
  render: () => <CollapsedWrapper />,
};
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Sidebar } from 'ece-docs-components';

const meta = {
  title: 'Components/Sidebar',
  component: Sidebar,
  argTypes: {
    centreName: { control: 'text' },
    onNavigate: { action: 'navigated' },
    onToggle: { action: 'toggled' },
    isAdmin: { control: 'boolean' },
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

const samplePolicies = [
  { id: 1, title: 'Philosophy and Values', url: '/policies/philosophy' },
  { id: 2, title: 'Te Tiriti o Waitangi', url: '/policies/te-tiriti' },
  {
    id: 3,
    title: 'Governance',
    url: '/policies/governance',
    items: [
      { id: 31, title: 'Internal Evaluation', url: '/policies/governance/internal-evaluation' },
      { id: 32, title: 'Health and Safety', url: '/policies/governance/health-and-safety' },
    ],
  },
];

const SidebarWrapper: React.FC<Partial<React.ComponentProps<typeof Sidebar>>> = (props) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Sidebar
      isOpen={isOpen}
      onToggle={() => setIsOpen((v) => !v)}
      centreName="Happy Kids Early Learning Centre"
      policies={samplePolicies}
      onNavigate={() => {}}
      isAdmin
      {...props}
    />
  );
};

export const Default: Story = {
  render: () => <SidebarWrapper />,
};

export const NotAdmin: Story = {
  render: () => <SidebarWrapper isAdmin={false} />,
};

const CollapsedWrapper: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Sidebar
      isOpen={isOpen}
      onToggle={() => setIsOpen((v) => !v)}
      centreName="Happy Kids Early Learning Centre"
      policies={samplePolicies}
      onNavigate={() => {}}
      isAdmin
    />
  );
};

export const CollapsedInitial: Story = {
  render: () => <CollapsedWrapper />,
};
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { SidebarV2, MenuItem } from 'ece-docs-components';

const meta = {
  title: 'Components/SidebarV2',
  component: SidebarV2,
  argTypes: {
    centreName: { control: 'text' },
    isAdmin: { control: 'boolean' },
    currentPath: { control: 'text' },
    hasMultipleOrganisations: { control: 'boolean' },
    onNavigate: { action: 'navigated' },
    onToggle: { action: 'toggled' },
    onOrgChange: { action: 'orgChanged' },
  },
} satisfies Meta<typeof SidebarV2>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleItems: MenuItem[] = [
  { id: 'home', title: 'Home', url: '/' },
  {
    id: 'policies',
    title: 'Policies',
    url: '/policies',
    items: [
      { id: 'philosophy', title: 'Philosophy and Values', url: '/policies/philosophy' },
      { id: 'te-tiriti', title: 'Te Tiriti o Waitangi', url: '/policies/te-tiriti' },
    ],
  },
  { id: 'settings', title: 'Settings', url: '/settings' },
];

const SidebarV2Wrapper: React.FC<{
  isAdmin?: boolean;
  currentPath?: string;
  hasMultipleOrganisations?: boolean;
}> = ({ isAdmin = true, currentPath = '/', hasMultipleOrganisations = false }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <SidebarV2
      isOpen={isOpen}
      onToggle={() => setIsOpen((v) => !v)}
      items={sampleItems}
      onNavigate={() => {}}
      isAdmin={isAdmin}
      currentPath={currentPath}
      onOrgChange={() => {}}
      hasMultipleOrganisations={hasMultipleOrganisations}
      centreName="Happy Kids Early Learning Centre"
    />
  );
};

export const Default: Story = {
  render: () => (
    <SidebarV2Wrapper currentPath="/policies/philosophy" />
  ),
};

export const NotAdmin: Story = {
  render: () => <SidebarV2Wrapper isAdmin={false} />,
};

export const MultipleOrganisations: Story = {
  render: () => (
    <SidebarV2Wrapper hasMultipleOrganisations currentPath="/settings" />
  ),
};
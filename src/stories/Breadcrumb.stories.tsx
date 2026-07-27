import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumb } from 'ece-docs-components';

const meta = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  argTypes: {
    currentItem: { control: 'text' },
    pathname: { control: 'text' },
    onItemSelect: { action: 'selected' },
    onNavigate: { action: 'navigated' },
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleItems = [
  { label: 'Policies', href: '/policies' },
  { label: 'Governance', href: '/policies/governance' },
];

const sampleDropdownItems = [
  { label: 'Philosophy and Values', href: '/policies/governance/philosophy-and-values' },
  { label: 'Te Tiriti o Waitangi', href: '/policies/governance/te-tiriti-o-waitangi' },
  { label: 'Self-Review and Internal Evaluation', href: '/policies/governance/self-review' },
];

export const Default: Story = {
  args: {
    items: sampleItems,
    currentItem: 'Philosophy and Values',
    pathname: '/policies/governance/philosophy-and-values',
    dropdownItems: sampleDropdownItems,
    onItemSelect: () => {},
  },
};

export const NoDropdown: Story = {
  args: {
    items: sampleItems,
    currentItem: 'Governance',
    pathname: '/policies/governance',
  },
};

export const SingleItem: Story = {
  args: {
    items: [{ label: 'Home', href: '/' }],
    currentItem: 'Dashboard',
    pathname: '/dashboard',
    dropdownItems: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Reports', href: '/reports' },
    ],
    onItemSelect: () => {},
  },
};
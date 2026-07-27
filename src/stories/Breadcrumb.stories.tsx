import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumb } from 'ece-docs-components';

const meta = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  argTypes: {
    currentItem: { control: 'text' },
    onItemSelect: { action: 'selected' },
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleItems = [
  { label: 'Policies', href: '/policies' },
  { label: 'Governance', href: '/policies/governance' },
];

const sampleDropdownItems = [
  'Philosophy and Values',
  'Te Tiriti o Waitangi',
  'Self-Review and Internal Evaluation',
];

export const Default: Story = {
  args: {
    items: sampleItems,
    currentItem: 'Philosophy and Values',
    dropdownItems: sampleDropdownItems,
    onItemSelect: () => {},
  },
};

export const NoDropdown: Story = {
  args: {
    items: sampleItems,
    currentItem: 'Governance',
  },
};

export const SingleItem: Story = {
  args: {
    items: [{ label: 'Home', href: '/' }],
    currentItem: 'Dashboard',
    dropdownItems: ['Dashboard', 'Reports'],
    onItemSelect: () => {},
  },
};
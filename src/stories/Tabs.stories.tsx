import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from 'ece-docs-components';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const tabs = [
  { id: 'overview', label: 'Overview', content: 'Overview content goes here.' },
  { id: 'details', label: 'Details', content: 'Detailed information about the policy.' },
  { id: 'history', label: 'History', content: 'Version history and revisions.' },
];

export const Default: Story = {
  args: { tabs, defaultTab: 'overview' },
};

export const SecondTab: Story = {
  args: { tabs, defaultTab: 'details' },
};

export const SingleTab: Story = {
  args: {
    tabs: [{ id: 'only', label: 'Only', content: 'Only one tab.' }],
    defaultTab: 'only',
  },
};

export const ManyTabs: Story = {
  args: {
    tabs: [
      { id: 't1', label: 'Tab 1', content: 'Content 1' },
      { id: 't2', label: 'Tab 2', content: 'Content 2' },
      { id: 't3', label: 'Tab 3', content: 'Content 3' },
      { id: 't4', label: 'Tab 4', content: 'Content 4' },
      { id: 't5', label: 'Tab 5', content: 'Content 5' },
    ],
    defaultTab: 't3',
  },
};
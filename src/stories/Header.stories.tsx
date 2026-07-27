import type { Meta, StoryObj } from '@storybook/react';
import { Header, HeaderSearchResult } from 'ece-docs-components';

const meta = {
  title: 'Components/Header',
  component: Header,
  argTypes: {
    userName: { control: 'text' },
    userInitials: { control: 'text' },
    signUpStatus: {
      control: 'select',
      options: ['Withdrawn', 'Onboarding', 'Active', 'In Review'],
    },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleSearch = (query: string): HeaderSearchResult[] => [
  { label: `${query} — result one`, value: 'result-1', description: 'A sample search result' },
  { label: `${query} — result two`, value: 'result-2' },
];

export const Default: Story = {
  args: {
    userName: 'John Doe',
    userInitials: 'JD',
    toggleMenu: () => {},
    signOut: () => {},
    signUpStatus: 'Active',
    search: sampleSearch,
    onResultClick: () => {},
  },
};

export const LongName: Story = {
  args: {
    userName: 'Alexandra Penelope Wellington',
    userInitials: 'AP',
    toggleMenu: () => {},
    signOut: () => {},
    signUpStatus: 'Onboarding',
    search: sampleSearch,
    onResultClick: () => {},
  },
};

export const ShortName: Story = {
  args: {
    userName: 'Bo',
    userInitials: 'B',
    toggleMenu: () => {},
    signOut: () => {},
    signUpStatus: 'In Review',
    search: sampleSearch,
    onResultClick: () => {},
  },
};
import type { Meta, StoryObj } from '@storybook/react';
import { RichTextArea } from 'ece-docs-components';

const meta = {
  title: 'Components/RichTextArea',
  component: RichTextArea,
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
    error: { control: 'text' },
    rows: { control: 'number' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
} satisfies Meta<typeof RichTextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 'Sample text',
    onChange: () => {},
    question: null,
    label: 'Policy wording',
    fullWidth: true,
  },
};

export const WithPlaceholder: Story = {
  args: {
    value: '',
    onChange: () => {},
    question: null,
    placeholder: 'Enter the policy wording here…',
    label: 'Policy wording',
    fullWidth: true,
  },
};

export const WithError: Story = {
  args: {
    value: 'Draft wording',
    onChange: () => {},
    question: null,
    label: 'Policy wording',
    error: 'This field is required.',
    fullWidth: true,
  },
};

export const Disabled: Story = {
  args: {
    value: 'Disabled content',
    onChange: () => {},
    question: null,
    label: 'Policy wording',
    disabled: true,
    fullWidth: true,
  },
};
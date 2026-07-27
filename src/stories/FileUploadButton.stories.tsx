import type { Meta, StoryObj } from '@storybook/react';
import { FileUploadButton } from 'ece-docs-components';

const meta = {
  title: 'Components/FileUploadButton',
  component: FileUploadButton,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'marked-read', 'mark-read', 'danger'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    label: { control: 'text' },
    accept: { control: 'text' },
    multiple: { control: 'boolean' },
    maxSizeBytes: { control: 'number' },
    sendToast: { control: 'boolean' },
    onFileSelect: { action: 'fileSelected' },
    onError: { action: 'error' },
  },
} satisfies Meta<typeof FileUploadButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: 'Upload a file',
    variant: 'primary',
    onFileSelect: () => {},
  },
};

export const Secondary: Story = {
  args: {
    label: 'Upload a file',
    variant: 'secondary',
    onFileSelect: () => {},
  },
};

export const Outline: Story = {
  args: {
    label: 'Choose files',
    variant: 'outline',
    multiple: true,
    onFileSelect: () => {},
  },
};

export const WithMaxSize: Story = {
  args: {
    label: 'Upload (max 1 MB)',
    variant: 'primary',
    maxSizeBytes: 1024 * 1024,
    sendToast: true,
    onFileSelect: () => {},
    onError: () => {},
  },
};

export const Danger: Story = {
  args: {
    label: 'Replace document',
    variant: 'danger',
    onFileSelect: () => {},
  },
};
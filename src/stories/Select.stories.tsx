import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent } from 'storybook/test';
import { Select } from 'ece-docs-components';

const meta = {
  title: 'Components/Select',
  component: Select,
  argTypes: {
    label: { control: 'text' },
    error: { control: 'text' },
    helperText: { control: 'text' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

const openDropdownPlay = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const canvas = within(canvasElement);
  const combobox = await canvas.findByRole('combobox');
  await userEvent.click(combobox);
};

export const Default: Story = {
  args: {
    label: 'Choose an option',
    options,
    value: 'option1',
    onChange: () => {},
  },
  play: openDropdownPlay,
};

export const WithoutLabel: Story = {
  args: { options, value: 'option2', onChange: () => {} },
  play: openDropdownPlay,
};

export const WithError: Story = {
  args: {
    label: 'Pick one',
    options,
    error: 'Please pick a valid option.',
    onChange: () => {},
  },
  play: openDropdownPlay,
};

export const WithHelperText: Story = {
  args: {
    label: 'Pick one',
    options,
    helperText: 'Select the option that best fits.',
    onChange: () => {},
  },
  play: openDropdownPlay,
};

export const Disabled: Story = {
  args: {
    label: 'Disabled select',
    options,
    disabled: true,
    value: 'option1',
    onChange: () => {},
  },
};

export const FullWidth: Story = {
  args: {
    label: 'Full width select',
    options,
    fullWidth: true,
    onChange: () => {},
  },
  play: openDropdownPlay,
};
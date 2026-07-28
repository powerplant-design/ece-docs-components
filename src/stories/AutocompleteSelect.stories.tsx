import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent } from 'storybook/test';
import { AutocompleteSelect } from 'ece-docs-components';

const meta = {
  title: 'Components/AutocompleteSelect',
  component: AutocompleteSelect,
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'text' },
    helperText: { control: 'text' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
} satisfies Meta<typeof AutocompleteSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

const options = [
  { value: 'ece', label: 'ECE Docs' },
  { value: 'school', label: 'School Docs' },
  { value: 'gp', label: 'GP Docs' },
  { value: 'lightn', label: 'Lightn' },
];

const openDropdownPlay = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const canvas = within(canvasElement);
  const combobox = await canvas.findByRole('combobox');
  await userEvent.click(combobox);
};

export const Default: Story = {
  args: {
    options,
    value: options[0],
    onChange: () => {},
    label: 'Choose a product',
    placeholder: 'Select…',
  },
  play: openDropdownPlay,
};

export const WithError: Story = {
  args: {
    options,
    value: null,
    onChange: () => {},
    label: 'Choose a product',
    error: 'Please select a product.',
    fullWidth: true,
  },
  play: openDropdownPlay,
};

export const WithHelperText: Story = {
  args: {
    options,
    value: null,
    onChange: () => {},
    label: 'Choose a product',
    helperText: 'Pick the option that best fits your team.',
    fullWidth: true,
  },
  play: openDropdownPlay,
};

export const Disabled: Story = {
  args: {
    options,
    value: options[1],
    onChange: () => {},
    label: 'Choose a product',
    disabled: true,
  },
};
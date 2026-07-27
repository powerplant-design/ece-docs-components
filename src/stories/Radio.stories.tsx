import type { Meta, StoryObj } from '@storybook/react';
import { Radio, RadioGroup } from 'ece-docs-components';

const meta = {
  title: 'Components/Radio',
} satisfies Meta<typeof Radio>;

export default meta;

type RadioStory = StoryObj<typeof Radio>;
type RadioGroupStory = StoryObj<typeof RadioGroup>;

export const RadioDefault: RadioStory = {
  name: 'Radio',
  render: (args) => <Radio label="Option A" {...args} />,
  args: { label: 'Option A' },
};

export const RadioWithDescription: RadioStory = {
  name: 'Radio With Description',
  render: () => (
    <Radio
      label="Option with description"
      description="Additional context for this option."
      name="group1"
    />
  ),
};

export const RadioDisabled: RadioStory = {
  name: 'Radio Disabled',
  render: () => <Radio label="Disabled option" disabled name="group2" />,
};

export const RadioGroupDefault: RadioGroupStory = {
  name: 'RadioGroup',
  render: () => (
    <RadioGroup label="Choose a plan">
      <Radio label="Free" name="plan" />
      <Radio label="Pro" name="plan" />
      <Radio label="Enterprise" name="plan" />
    </RadioGroup>
  ),
};

export const RadioGroupWithError: RadioGroupStory = {
  name: 'RadioGroup With Error',
  render: () => (
    <RadioGroup label="Pick one" error="You must select an option.">
      <Radio label="Yes" name="yn" />
      <Radio label="No" name="yn" />
    </RadioGroup>
  ),
};
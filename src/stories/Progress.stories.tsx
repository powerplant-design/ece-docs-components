import type { Meta, StoryObj } from '@storybook/react';
import { Progress, StepIndicator } from 'ece-docs-components';

const meta = {
  title: 'Components/Progress',
} satisfies Meta<typeof Progress>;

export default meta;

type ProgressStory = StoryObj<typeof Progress>;
type StepIndicatorStory = StoryObj<typeof StepIndicator>;

export const ProgressDefault: ProgressStory = {
  name: 'Progress',
  render: (args) => <Progress current={3} total={10} {...args} />,
  args: { current: 3, total: 10, showLabel: true },
};

export const ProgressComplete: ProgressStory = {
  name: 'Progress Complete',
  render: () => <Progress current={10} total={10} />,
};

export const ProgressNoLabel: ProgressStory = {
  name: 'Progress No Label',
  render: () => <Progress current={4} total={8} showLabel={false} />,
};

export const StepIndicatorDefault: StepIndicatorStory = {
  name: 'StepIndicator',
  render: (args) => (
    <StepIndicator
      steps={['Introduction', 'Policies', 'Review', 'Submit']}
      currentStep={2}
      {...args}
    />
  ),
  args: { steps: ['Introduction', 'Policies', 'Review', 'Submit'], currentStep: 2 },
};

export const StepIndicatorLast: StepIndicatorStory = {
  name: 'StepIndicator Last Step',
  render: () => (
    <StepIndicator steps={['Start', 'Middle', 'End']} currentStep={3} />
  ),
};
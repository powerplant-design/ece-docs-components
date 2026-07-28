import type { Meta, StoryObj } from '@storybook/react';
import { AcknowledgementBox } from 'ece-docs-components';

const meta = {
  title: 'Components/AcknowledgementBox',
  component: AcknowledgementBox,
} satisfies Meta<typeof AcknowledgementBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <p>
        We acknowledge the tangata whenua of Aotearoa and honour our commitments
        under Te Tiriti o Waitangi.
      </p>
    ),
  },
};
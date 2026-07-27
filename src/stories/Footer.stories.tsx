import type { Meta, StoryObj } from '@storybook/react';
import { Footer } from 'ece-docs-components';

const meta = {
  title: 'Components/Footer',
  component: Footer,
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Footer />,
};
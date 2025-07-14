import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '@/components/ui/input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Type here...',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Can't type here",
    disabled: true,
  },
};

export const WithValue: Story = {
  args: {
    value: 'Pre-filled',
    onChange: () => {},
  },
};

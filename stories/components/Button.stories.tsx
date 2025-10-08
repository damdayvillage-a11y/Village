import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../lib/components/ui/Button';

const meta: Meta<typeof Button> = {
  title: 'Design System/Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Enhanced Button component with design system integration and multiple variants.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'outline', 'ghost', 'destructive'],
      description: 'The visual style variant of the button',
    },
    size: {
      control: 'select', 
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'The size of the button',
    },
    loading: {
      control: 'boolean',
      description: 'Shows loading state with spinner',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button',
    },
    iconPosition: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Position of the icon relative to text',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic button variants
export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'default',
    size: 'md',
  },
};

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
    size: 'md',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
    size: 'md',
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline Button',
    variant: 'outline',
    size: 'md',
  },
};

export const Ghost: Story = {
  args: {
    children: 'Ghost Button',
    variant: 'ghost',
    size: 'md',
  },
};

export const Destructive: Story = {
  args: {
    children: 'Delete',
    variant: 'destructive',
    size: 'md',
  },
};

// Size variations
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
    </div>
  ),
  name: 'All Sizes',
};

// Loading states
export const Loading: Story = {
  args: {
    children: 'Loading...',
    variant: 'primary',
    size: 'md',
    loading: true,
  },
};

export const LoadingStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button variant="primary" loading>Primary Loading</Button>
        <Button variant="secondary" loading>Secondary Loading</Button>
        <Button variant="outline" loading>Outline Loading</Button>
      </div>
    </div>
  ),
  name: 'Loading States',
};

// Disabled states
export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    variant: 'primary',
    size: 'md',
    disabled: true,
  },
};

// With icons (placeholder for now - will implement with actual icons later)
export const WithIcon: Story = {
  args: {
    children: 'Download',
    variant: 'primary',
    size: 'md',
    icon: '⬇️',
    iconPosition: 'left',
  },
};

export const IconRight: Story = {
  args: {
    children: 'Next',
    variant: 'outline',
    size: 'md',
    icon: '→',
    iconPosition: 'right',
  },
};

// All variants showcase
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Button variant="default">Default</Button>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
      </div>
      
      <div className="flex flex-wrap gap-4">
        <Button variant="default" disabled>Default</Button>
        <Button variant="primary" disabled>Primary</Button>
        <Button variant="secondary" disabled>Secondary</Button>
        <Button variant="outline" disabled>Outline</Button>
        <Button variant="ghost" disabled>Ghost</Button>
        <Button variant="destructive" disabled>Destructive</Button>
      </div>
    </div>
  ),
  name: 'All Variants',
};

// Interactive demo
export const InteractiveDemo: Story = {
  render: (args) => (
    <div className="space-y-6">
      <Button {...args}>{args.children || 'Interactive Button'}</Button>
      
      <div className="text-sm text-neutral-600 space-y-2">
        <p>Use the controls panel to customize this button:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Change the variant to see different styles</li>
          <li>Adjust the size from xs to xl</li>
          <li>Toggle loading and disabled states</li>
          <li>Add an icon and change its position</li>
        </ul>
      </div>
    </div>
  ),
  args: {
    children: 'Customize Me',
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
  },
  name: 'Interactive Demo',
};
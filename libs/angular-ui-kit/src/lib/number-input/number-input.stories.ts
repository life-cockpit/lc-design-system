import type { Meta, StoryObj } from '@storybook/angular';
import { NumberInputComponent } from './number-input.component';

const meta: Meta<NumberInputComponent> = {
  title: 'Form/Number Input',
  component: NumberInputComponent,
  argTypes: {
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    disabled: { control: 'boolean' },
  },

  parameters: {
    docs: {
      description: {
        component: `
Number input component with increment/decrement controls.

**Key Features:**
- Increment and decrement buttons
- Configurable min, max, and step values
- Value clamping within bounds
- Disabled state support
- ControlValueAccessor integration for reactive forms
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<NumberInputComponent>;

export const Default: Story = {
  args: { label: 'Quantity', min: 0, max: 99, step: 1 },
};

export const WithStep: Story = {
  args: { label: 'Guests', min: 0, max: 50, step: 5 },
};

export const Disabled: Story = {
  args: { label: 'Locked', min: 0, max: 10, step: 1, disabled: true },
};

export const NoLimits: Story = {
  args: { label: 'Value', step: 1 },
};

export const NoLabel: Story = {
  args: { min: 1, max: 10, step: 1 },
};

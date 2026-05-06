import type { Meta, StoryObj } from '@storybook/angular';
import { ProgressBarComponent } from './progress-bar.component';

const meta: Meta<ProgressBarComponent> = {
  title: 'Feedback/Progress Bar',
  component: ProgressBarComponent,
  parameters: {
    docs: {
      description: {
        component: `
Progress bar for displaying completion status.

**Key Features:**
- Linear and circular variants
- 6 color themes
- 4 size options (xs, sm, md, lg)
- Optional percentage label
- Indeterminate mode with animation
- Full ARIA support
        `,
      },
    },
  },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100 }, description: 'Progress 0–100' },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'info'],
      table: { defaultValue: { summary: 'primary' } },
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      table: { defaultValue: { summary: 'md' } },
    },
    variant: {
      control: 'select',
      options: ['linear', 'circular'],
      table: { defaultValue: { summary: 'linear' } },
    },
    showLabel: { control: 'boolean', table: { defaultValue: { summary: 'false' } } },
    indeterminate: { control: 'boolean', table: { defaultValue: { summary: 'false' } } },
  },
};

export default meta;
type Story = StoryObj<ProgressBarComponent>;

export const Default: Story = {
  args: { value: 65, color: 'primary', size: 'md', showLabel: true },
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <lc-progress-bar [value]="60" size="xs" [showLabel]="true"></lc-progress-bar>
        <lc-progress-bar [value]="60" size="sm" [showLabel]="true"></lc-progress-bar>
        <lc-progress-bar [value]="60" size="md" [showLabel]="true"></lc-progress-bar>
        <lc-progress-bar [value]="60" size="lg" [showLabel]="true"></lc-progress-bar>
      </div>`,
  }),
};

export const Colors: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; max-width: 400px;">
        <lc-progress-bar [value]="70" color="primary" [showLabel]="true"></lc-progress-bar>
        <lc-progress-bar [value]="70" color="secondary" [showLabel]="true"></lc-progress-bar>
        <lc-progress-bar [value]="70" color="success" [showLabel]="true"></lc-progress-bar>
        <lc-progress-bar [value]="70" color="warning" [showLabel]="true"></lc-progress-bar>
        <lc-progress-bar [value]="70" color="error" [showLabel]="true"></lc-progress-bar>
        <lc-progress-bar [value]="70" color="info" [showLabel]="true"></lc-progress-bar>
      </div>`,
  }),
};

export const Indeterminate: Story = {
  args: { indeterminate: true, color: 'primary', size: 'md' },
};

export const Circular: Story = {
  args: { value: 72, variant: 'circular', color: 'primary', size: 'md', showLabel: true },
};

export const CircularSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 24px; align-items: center;">
        <lc-progress-bar [value]="75" variant="circular" size="xs" [showLabel]="true"></lc-progress-bar>
        <lc-progress-bar [value]="75" variant="circular" size="sm" [showLabel]="true"></lc-progress-bar>
        <lc-progress-bar [value]="75" variant="circular" size="md" [showLabel]="true"></lc-progress-bar>
        <lc-progress-bar [value]="75" variant="circular" size="lg" [showLabel]="true"></lc-progress-bar>
      </div>`,
  }),
};

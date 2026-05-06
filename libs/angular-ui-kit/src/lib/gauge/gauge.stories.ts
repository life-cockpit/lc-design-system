import type { Meta, StoryObj } from '@storybook/angular';
import { GaugeComponent } from './gauge.component';

const meta: Meta<GaugeComponent> = {
  title: 'Charts/Gauge',
  component: GaugeComponent,
  tags: ['autodocs'],
  argTypes: {
    color: { control: 'select', options: ['primary', 'secondary', 'success', 'warning', 'error', 'info'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },

  parameters: {
    docs: {
      description: {
        component: `
Gauge component for displaying a value on a semicircular scale.

**Key Features:**
- Semicircle arc with value and track segments
- Color theme variants (primary, secondary, success, warning, error)
- Size presets (sm, md, lg)
- Configurable max value and suffix
- Optional numeric value display
- Responsive SVG rendering
`,
      },
    },
  },
};
export default meta;
type Story = StoryObj<GaugeComponent>;

export const Default: Story = { args: { value: 72, label: 'Performance' } };
export const Success: Story = { args: { value: 95, label: 'Uptime', color: 'success' } };
export const Warning: Story = { args: { value: 45, label: 'Score', color: 'warning' } };
export const Error: Story = { args: { value: 18, label: 'Battery', color: 'error' } };
export const Small: Story = { args: { value: 60, label: 'CPU', size: 'sm' } };
export const Large: Story = { args: { value: 82, label: 'Progress', size: 'lg', color: 'info' } };
export const CustomSuffix: Story = { args: { value: 37, suffix: '°C', label: 'Temperature', max: 50 } };

export const Dashboard: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 2rem; flex-wrap: wrap;">
        <lc-gauge [value]="72" label="CPU" color="primary"></lc-gauge>
        <lc-gauge [value]="45" label="Memory" color="warning"></lc-gauge>
        <lc-gauge [value]="92" label="Disk" color="success"></lc-gauge>
        <lc-gauge [value]="15" label="Network" color="error"></lc-gauge>
      </div>
    `,
    moduleMetadata: { imports: [GaugeComponent] },
  }),
};

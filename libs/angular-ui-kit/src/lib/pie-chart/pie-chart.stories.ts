import type { Meta, StoryObj } from '@storybook/angular';
import { PieChartComponent } from './pie-chart.component';

const meta: Meta<PieChartComponent> = {
  title: 'Charts/Pie Chart',
  component: PieChartComponent,
  tags: ['autodocs'],
  argTypes: { size: { control: 'select',
  options: ['sm',
  'md',
  'lg'] } },
  parameters: {
    docs: {
      description: {
        component: `
Pie chart component for displaying proportional data.

**Key Features:**
- Color-coded segments with automatic arc calculation
- Size presets (sm, md, lg)
- Optional legend display
- Hover state support
- Responsive SVG rendering
`,
      },
    },
  },
};
export default meta;
type Story = StoryObj<PieChartComponent>;

export const Default: Story = { args: { segments: [{ value: 45, label: 'Desktop' }, { value: 30, label: 'Mobile' }, { value: 15, label: 'Tablet' }, { value: 10, label: 'Other' }] } };
export const WithLegend: Story = { args: { segments: [{ value: 45, label: 'Desktop' }, { value: 30, label: 'Mobile' }, { value: 15, label: 'Tablet' }, { value: 10, label: 'Other' }], showLegend: true, size: 'lg' } };
export const TwoSegments: Story = { args: { segments: [{ value: 72, label: 'Yes' }, { value: 28, label: 'No' }], showLegend: true } };

import type { Meta, StoryObj } from '@storybook/angular';
import { LineChartComponent } from './line-chart.component';

const meta: Meta<LineChartComponent> = {
  title: 'Charts/Line Chart',
  component: LineChartComponent,
  tags: ['autodocs'],

  parameters: {
    docs: {
      description: {
        component: `
Line chart component for visualizing data trends.

**Key Features:**
- Multiple data series support
- Smooth or linear curve interpolation
- Optional area fill below lines
- Configurable grid, axis labels, dots, and legend
- Responsive SVG rendering with configurable dimensions
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<LineChartComponent>;

export const SingleSeries: Story = {
  args: {
    series: [
      { label: 'Revenue', data: [20, 35, 28, 42, 55, 48, 62, 70, 58, 75, 68, 80] },
    ],
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    width: 500,
    height: 250,
  },
};

export const MultipleSeries: Story = {
  args: {
    series: [
      { label: 'Revenue', data: [20, 35, 28, 42, 55, 48, 62, 70] },
      { label: 'Costs', data: [15, 20, 22, 25, 28, 30, 35, 32] },
      { label: 'Profit', data: [5, 15, 6, 17, 27, 18, 27, 38] },
    ],
    labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8'],
    showLegend: true,
    width: 500,
    height: 250,
  },
};

export const Filled: Story = {
  args: {
    series: [
      { label: 'Users', data: [100, 150, 130, 180, 220, 200, 260, 300], color: 'var(--color-primary-500)' },
    ],
    labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'],
    filled: true,
    width: 500,
    height: 250,
  },
};

export const StraightLines: Story = {
  args: {
    series: [
      { label: 'Temperature', data: [5, 8, 12, 18, 22, 25, 28, 26, 20, 14, 8, 4] },
    ],
    labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
    smooth: false,
    width: 500,
    height: 250,
  },
};

export const NoDots: Story = {
  args: {
    series: [
      { label: 'Requests', data: [450, 520, 480, 600, 550, 700, 680, 750, 720, 800] },
    ],
    showDots: false,
    filled: true,
    width: 500,
    height: 200,
  },
};

export const Compact: Story = {
  args: {
    series: [
      { label: 'CPU', data: [30, 45, 60, 42, 55, 70, 50, 65] },
    ],
    width: 250,
    height: 120,
    showGrid: false,
    showXLabels: false,
    showYLabels: false,
    strokeWidth: 1.5,
  },
};

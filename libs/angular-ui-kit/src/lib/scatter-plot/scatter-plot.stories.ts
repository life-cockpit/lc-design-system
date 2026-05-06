import type { Meta, StoryObj } from '@storybook/angular';
import { ScatterPlotComponent } from './scatter-plot.component';

const meta: Meta<ScatterPlotComponent> = {
  title: 'Charts/Scatter Plot',
  component: ScatterPlotComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Scatter plot for visualizing correlations between two variables. ' +
          'Supports multiple series, variable dot sizes, axis labels, tooltips, and legend.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<ScatterPlotComponent>;

export const Basic: Story = {
  args: {
    series: [
      {
        label: 'Students',
        data: [
          { x: 2, y: 65 }, { x: 3, y: 72 }, { x: 4, y: 78 },
          { x: 5, y: 82 }, { x: 6, y: 88 }, { x: 7, y: 91 },
          { x: 1, y: 55 }, { x: 3.5, y: 70 }, { x: 5.5, y: 85 },
        ],
      },
    ],
    xAxisLabel: 'Study Hours',
    yAxisLabel: 'Score',
    width: 500,
    height: 300,
  },
};

export const MultipleSeries: Story = {
  args: {
    series: [
      {
        label: 'Group A',
        data: [
          { x: 10, y: 20 }, { x: 15, y: 25 }, { x: 20, y: 35 },
          { x: 25, y: 30 }, { x: 30, y: 45 },
        ],
      },
      {
        label: 'Group B',
        data: [
          { x: 12, y: 30 }, { x: 18, y: 40 }, { x: 22, y: 28 },
          { x: 28, y: 50 }, { x: 35, y: 55 },
        ],
      },
    ],
    showLegend: true,
    width: 500,
    height: 300,
  },
};

export const BubbleStyle: Story = {
  args: {
    series: [
      {
        label: 'Revenue',
        data: [
          { x: 10, y: 20, size: 5 }, { x: 20, y: 35, size: 10 },
          { x: 30, y: 25, size: 8 }, { x: 40, y: 50, size: 15 },
          { x: 50, y: 40, size: 12 }, { x: 60, y: 60, size: 20 },
        ],
      },
    ],
    width: 500,
    height: 300,
    xAxisLabel: 'Employees',
    yAxisLabel: 'Revenue (M$)',
  },
};

export const Compact: Story = {
  args: {
    series: [
      {
        label: 'Data',
        data: Array.from({ length: 30 }, (_, i) => ({
          x: Math.random() * 100,
          y: Math.random() * 100,
        })),
      },
    ],
    width: 300,
    height: 200,
    showGrid: false,
    showXLabels: false,
    showYLabels: false,
    dotRadius: 3,
  },
};

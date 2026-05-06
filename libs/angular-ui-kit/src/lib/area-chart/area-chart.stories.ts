import type { Meta, StoryObj } from '@storybook/angular';
import { AreaChartComponent } from './area-chart.component';

const meta: Meta<AreaChartComponent> = { title: 'Charts/Area Chart', component: AreaChartComponent, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<AreaChartComponent>;

export const Default: Story = {
  args: {
    series: [{ label: 'Revenue', data: [20, 35, 28, 42, 55, 48, 62, 70, 58, 75, 68, 80] }],
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    width: 500, height: 250,
  },
};

export const Stacked: Story = {
  args: {
    series: [
      { label: 'Desktop', data: [40, 45, 50, 55, 60, 58, 62, 65] },
      { label: 'Mobile', data: [20, 25, 28, 30, 35, 38, 40, 42] },
      { label: 'Tablet', data: [5, 8, 7, 10, 12, 10, 14, 15] },
    ],
    labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'],
    stacked: true, showLegend: true, fillOpacity: 0.4, width: 500, height: 250,
  },
};

export const MultipleSeries: Story = {
  args: {
    series: [
      { label: 'Revenue', data: [20, 35, 28, 42, 55, 48, 62, 70] },
      { label: 'Costs', data: [15, 20, 22, 25, 28, 30, 35, 32] },
    ],
    showLegend: true, showDots: true, width: 500, height: 250,
  },
};

export const HighOpacity: Story = {
  args: {
    series: [{ label: 'Traffic', data: [100, 150, 130, 180, 220, 200, 260, 300] }],
    fillOpacity: 0.5, width: 500, height: 200,
  },
};

import type { Meta, StoryObj } from '@storybook/angular';
import { WaterfallChartComponent } from './waterfall-chart.component';

const meta: Meta<WaterfallChartComponent> = { title: 'Charts/Waterfall Chart', component: WaterfallChartComponent, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<WaterfallChartComponent>;

export const Default: Story = {
  args: {
    data: [
      { label: 'Revenue', value: 420, type: 'total' },
      { label: 'COGS', value: -150 },
      { label: 'Gross', value: 270, type: 'total' },
      { label: 'Opex', value: -80 },
      { label: 'Tax', value: -40 },
      { label: 'Net', value: 150, type: 'total' },
    ],
  },
};

export const Simple: Story = {
  args: {
    data: [
      { label: 'Start', value: 100, type: 'total' },
      { label: 'Sales', value: 50 },
      { label: 'Returns', value: -15 },
      { label: 'Discounts', value: -10 },
      { label: 'End', value: 125, type: 'total' },
    ],
    width: 400,
    height: 200,
  },
};

export const MonthlyPL: Story = {
  args: {
    data: [
      { label: 'Jan', value: 200, type: 'total' },
      { label: 'Feb', value: 30 },
      { label: 'Mar', value: -20 },
      { label: 'Apr', value: 45 },
      { label: 'May', value: -35 },
      { label: 'Jun', value: 60 },
      { label: 'Jul', value: -15 },
      { label: 'Total', value: 265, type: 'total' },
    ],
    width: 600,
    height: 280,
  },
};

import type { Meta, StoryObj } from '@storybook/angular';
import { BarChartComponent } from './bar-chart.component';

const meta: Meta<BarChartComponent> = {
  title: 'Charts/Bar Chart',
  component: BarChartComponent,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
    },
  },
};

export default meta;
type Story = StoryObj<BarChartComponent>;

export const Default: Story = {
  args: {
    data: [
      { value: 45, label: 'Jan' },
      { value: 72, label: 'Feb' },
      { value: 58, label: 'Mar' },
      { value: 90, label: 'Apr' },
      { value: 65, label: 'May' },
      { value: 82, label: 'Jun' },
    ],
  },
};

export const Horizontal: Story = {
  args: {
    data: [
      { value: 120, label: 'React' },
      { value: 95, label: 'Angular' },
      { value: 78, label: 'Vue' },
      { value: 45, label: 'Svelte' },
      { value: 30, label: 'Ember' },
    ],
    orientation: 'horizontal',
    height: 250,
  },
};

export const SingleColor: Story = {
  args: {
    data: [
      { value: 30, label: 'Mon' },
      { value: 65, label: 'Tue' },
      { value: 42, label: 'Wed' },
      { value: 78, label: 'Thu' },
      { value: 55, label: 'Fri' },
    ],
    color: 'var(--color-primary-500)',
  },
};

export const CustomColors: Story = {
  args: {
    data: [
      { value: 85, label: 'Q1', color: '#22c55e' },
      { value: 60, label: 'Q2', color: '#f59e0b' },
      { value: 95, label: 'Q3', color: '#3b82f6' },
      { value: 45, label: 'Q4', color: '#ef4444' },
    ],
    width: 300,
    height: 180,
  },
};

export const NoGrid: Story = {
  args: {
    data: [
      { value: 45, label: 'A' },
      { value: 72, label: 'B' },
      { value: 58, label: 'C' },
    ],
    showGrid: false,
    width: 250,
    height: 150,
  },
};

export const Wide: Story = {
  args: {
    data: [
      { value: 20, label: 'Jan' },
      { value: 35, label: 'Feb' },
      { value: 28, label: 'Mar' },
      { value: 42, label: 'Apr' },
      { value: 55, label: 'May' },
      { value: 48, label: 'Jun' },
      { value: 62, label: 'Jul' },
      { value: 70, label: 'Aug' },
      { value: 58, label: 'Sep' },
      { value: 75, label: 'Oct' },
      { value: 68, label: 'Nov' },
      { value: 80, label: 'Dec' },
    ],
    width: 600,
    height: 250,
    color: 'var(--color-info-default)',
  },
};

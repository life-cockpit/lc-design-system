import type { Meta, StoryObj } from '@storybook/angular';
import { DonutChartComponent } from './donut-chart.component';

const meta: Meta<DonutChartComponent> = {
  title: 'Charts/Donut Chart',
  component: DonutChartComponent,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<DonutChartComponent>;

export const Default: Story = {
  args: {
    segments: [
      { value: 45, label: 'Desktop' },
      { value: 30, label: 'Mobile' },
      { value: 15, label: 'Tablet' },
      { value: 10, label: 'Other' },
    ],
    centerValue: '100%',
    centerLabel: 'Traffic',
  },
};

export const WithLegend: Story = {
  args: {
    segments: [
      { value: 45, label: 'Desktop' },
      { value: 30, label: 'Mobile' },
      { value: 15, label: 'Tablet' },
      { value: 10, label: 'Other' },
    ],
    centerValue: '4,210',
    centerLabel: 'Visits',
    showLegend: true,
  },
};

export const TwoSegments: Story = {
  args: {
    segments: [
      { value: 72, label: 'Completed' },
      { value: 28, label: 'Remaining' },
    ],
    centerValue: '72%',
    centerLabel: 'Done',
  },
};

export const CustomColors: Story = {
  args: {
    segments: [
      { value: 40, label: 'Active', color: '#22c55e' },
      { value: 25, label: 'Idle', color: '#f59e0b' },
      { value: 20, label: 'Offline', color: '#ef4444' },
      { value: 15, label: 'Unknown', color: '#94a3b8' },
    ],
    centerValue: '156',
    centerLabel: 'Servers',
    showLegend: true,
    size: 'lg',
  },
};

export const Small: Story = {
  args: {
    segments: [
      { value: 65, label: 'Used' },
      { value: 35, label: 'Free' },
    ],
    centerValue: '65%',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    segments: [
      { value: 30, label: 'React' },
      { value: 25, label: 'Angular' },
      { value: 20, label: 'Vue' },
      { value: 15, label: 'Svelte' },
      { value: 10, label: 'Other' },
    ],
    centerValue: '5',
    centerLabel: 'Frameworks',
    showLegend: true,
    size: 'lg',
  },
};

export const ThickRing: Story = {
  args: {
    segments: [
      { value: 80, label: 'Complete' },
      { value: 20, label: 'Incomplete' },
    ],
    centerValue: '80%',
    thickness: 0.5,
  },
};

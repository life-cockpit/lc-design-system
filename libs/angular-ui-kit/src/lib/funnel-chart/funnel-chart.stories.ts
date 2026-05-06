import type { Meta, StoryObj } from '@storybook/angular';
import { FunnelChartComponent } from './funnel-chart.component';

const meta: Meta<FunnelChartComponent> = {
  title: 'Charts/Funnel Chart',
  component: FunnelChartComponent,
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'radio', options: ['vertical', 'horizontal'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Funnel chart for visualizing conversion pipelines and progressive filtering. ' +
          'Supports vertical and horizontal orientations, percentage display, and custom colors.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<FunnelChartComponent>;

export const SalesFunnel: Story = {
  args: {
    steps: [
      { label: 'Website Visits', value: 15000 },
      { label: 'Sign-ups', value: 8000 },
      { label: 'Trial Started', value: 4000 },
      { label: 'Paid Conversion', value: 1200 },
      { label: 'Retained', value: 900 },
    ],
    width: 450,
    height: 350,
  },
};

export const Horizontal: Story = {
  args: {
    steps: [
      { label: 'Leads', value: 500 },
      { label: 'Qualified', value: 300 },
      { label: 'Proposal', value: 150 },
      { label: 'Closed', value: 60 },
    ],
    orientation: 'horizontal',
    width: 500,
    height: 250,
  },
};

export const CustomColors: Story = {
  args: {
    steps: [
      { label: 'Awareness', value: 10000, color: '#6366f1' },
      { label: 'Interest', value: 6000, color: '#8b5cf6' },
      { label: 'Decision', value: 2500, color: '#a855f7' },
      { label: 'Action', value: 1000, color: '#d946ef' },
    ],
    width: 400,
    height: 300,
  },
};

export const ValuesOnly: Story = {
  args: {
    steps: [
      { label: 'Step 1', value: 800 },
      { label: 'Step 2', value: 500 },
      { label: 'Step 3', value: 200 },
    ],
    showPercentage: false,
    width: 350,
    height: 250,
  },
};

export const PercentagesOnly: Story = {
  args: {
    steps: [
      { label: 'Total', value: 5000 },
      { label: 'Filtered', value: 3000 },
      { label: 'Result', value: 500 },
    ],
    showValues: false,
    width: 350,
    height: 250,
  },
};

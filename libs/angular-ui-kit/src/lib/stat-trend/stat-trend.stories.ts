import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { StatTrendComponent } from './stat-trend.component';
import { SparklineComponent } from '../sparkline/sparkline.component';

const meta: Meta<StatTrendComponent> = {
  title: 'Charts/Stat Trend',
  component: StatTrendComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [SparklineComponent],
    }),
  ],
  argTypes: {
    direction: {
      control: 'select',
      options: [undefined, 'up', 'down', 'neutral'],
    },
  },
};

export default meta;
type Story = StoryObj<StatTrendComponent>;

export const UpTrend: Story = {
  args: {
    label: 'Revenue',
    value: '$42,350',
    change: '+12.5%',
    sparklineData: [20, 25, 22, 30, 28, 35, 32, 40, 38, 42],
  },
};

export const DownTrend: Story = {
  args: {
    label: 'Churn Rate',
    value: '3.2%',
    change: '-0.8%',
    sparklineData: [8, 7, 7.5, 6, 5.5, 5, 4.5, 4, 3.5, 3.2],
  },
};

export const Neutral: Story = {
  args: {
    label: 'Users Online',
    value: '1,234',
    change: '0%',
    sparklineData: [120, 125, 118, 122, 120, 123, 119, 121, 124, 123],
  },
};

export const NoSparkline: Story = {
  args: {
    label: 'Total Orders',
    value: '8,421',
    change: '+3.1%',
  },
};

export const ValueOnly: Story = {
  args: {
    value: '99.9%',
    label: 'Uptime',
  },
};

export const DashboardRow: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 2rem; flex-wrap: wrap;">
        <lc-stat-trend
          label="Revenue"
          value="$42,350"
          change="+12.5%"
          [sparklineData]="revenueData"
        ></lc-stat-trend>

        <lc-stat-trend
          label="Users"
          value="12,842"
          change="+5.2%"
          [sparklineData]="usersData"
        ></lc-stat-trend>

        <lc-stat-trend
          label="Bounce Rate"
          value="24.3%"
          change="-2.1%"
          [sparklineData]="bounceData"
        ></lc-stat-trend>

        <lc-stat-trend
          label="Avg Session"
          value="4m 32s"
          change="0%"
          [sparklineData]="sessionData"
        ></lc-stat-trend>
      </div>
    `,
    props: {
      revenueData: [20, 25, 22, 30, 28, 35, 32, 40, 38, 42],
      usersData: [100, 110, 105, 115, 120, 118, 125, 128, 130, 128],
      bounceData: [35, 32, 30, 28, 27, 26, 25, 24, 25, 24],
      sessionData: [4.2, 4.5, 4.3, 4.6, 4.4, 4.5, 4.3, 4.5, 4.6, 4.5],
    },
    moduleMetadata: {
      imports: [StatTrendComponent],
    },
  }),
};

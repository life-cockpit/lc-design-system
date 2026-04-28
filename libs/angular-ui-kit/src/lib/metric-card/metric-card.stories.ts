import type { Meta, StoryObj } from '@storybook/angular';
import { MetricCardComponent } from './metric-card.component';

/**
 * Metric cards display KPIs and key statistics with an optional trend indicator.
 * Use them in dashboards, analytics pages, and overview sections to highlight
 * important numbers at a glance.
 */
const meta: Meta<MetricCardComponent> = {
  title: 'Data Display/Metric Card',
  component: MetricCardComponent,
  tags: ['autodocs'],
  argTypes: {
    label: { description: 'Label describing what the metric measures' },
    value: { description: 'The formatted metric value (e.g. "$12,450", "98.5%")' },
    trend: {
      control: 'select',
      options: ['up', 'down', 'flat'],
      description: 'Direction of the trend arrow',
    },
    trendValue: { description: 'Formatted trend change (e.g. "+12.5%", "-3.2%")' },
    icon: { description: 'Icon name displayed alongside the metric' },
  },
};

export default meta;
type Story = StoryObj<MetricCardComponent>;

export const Default: Story = {
  args: { label: 'Total Revenue', value: '$12,450', trend: 'up', trendValue: '+12.5%', icon: 'currency-dollar' },
};

export const TrendDown: Story = {
  name: 'Negative Trend',
  args: { label: 'Bounce Rate', value: '34.2%', trend: 'down', trendValue: '-5.1%', icon: 'chart-bar' },
};

export const TrendFlat: Story = {
  name: 'Flat Trend',
  args: { label: 'Active Users', value: '1,234', trend: 'flat', trendValue: '0%', icon: 'users' },
};

export const WithoutTrend: Story = {
  name: 'Without Trend Value',
  args: { label: 'Total Projects', value: '42', icon: 'folder' },
};

export const Dashboard: Story = {
  name: 'Dashboard Overview (Composition)',
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; max-width: 900px;">
        <lc-metric-card
          label="Total Revenue"
          value="$84,254"
          trend="up"
          trendValue="+12.5%"
          icon="currency-dollar"
        ></lc-metric-card>
        <lc-metric-card
          label="New Users"
          value="2,143"
          trend="up"
          trendValue="+8.2%"
          icon="user-plus"
        ></lc-metric-card>
        <lc-metric-card
          label="Conversion Rate"
          value="3.24%"
          trend="down"
          trendValue="-0.4%"
          icon="chart-bar"
        ></lc-metric-card>
        <lc-metric-card
          label="Avg. Session"
          value="4m 32s"
          trend="flat"
          trendValue="0%"
          icon="clock"
        ></lc-metric-card>
      </div>`,
  }),
};

export const EcommerceDashboard: Story = {
  name: 'E-Commerce Metrics',
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; max-width: 700px;">
        <lc-metric-card
          label="Orders Today"
          value="156"
          trend="up"
          trendValue="+23%"
          icon="shopping-cart"
        ></lc-metric-card>
        <lc-metric-card
          label="Items Shipped"
          value="89"
          trend="up"
          trendValue="+11%"
          icon="truck"
        ></lc-metric-card>
        <lc-metric-card
          label="Returns"
          value="7"
          trend="down"
          trendValue="-2"
          icon="arrow-uturn-left"
        ></lc-metric-card>
      </div>`,
  }),
};

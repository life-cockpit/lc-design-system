import type { Meta, StoryObj } from '@storybook/angular';
import { RadarChartComponent } from './radar-chart.component';

const meta: Meta<RadarChartComponent> = { title: 'Charts/Radar Chart', component: RadarChartComponent, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<RadarChartComponent>;

export const Default: Story = {
  args: {
    series: [{ label: 'Player A', data: [85, 70, 90, 60, 75, 80] }],
    axes: ['Speed', 'Shooting', 'Passing', 'Defense', 'Dribbling', 'Physical'],
  },
};

export const MultipleSeries: Story = {
  args: {
    series: [
      { label: 'Player A', data: [85, 70, 90, 60, 75, 80] },
      { label: 'Player B', data: [70, 85, 65, 80, 60, 75] },
      { label: 'Player C', data: [60, 75, 80, 70, 90, 55] },
      { label: 'Player D', data: [75, 60, 55, 90, 80, 70] },
    ],
    axes: ['Speed', 'Shooting', 'Passing', 'Defense', 'Dribbling', 'Physical'],
    showLegend: true,
  },
};

export const Skills: Story = {
  args: {
    series: [{ label: 'Skills', data: [95, 80, 70, 60, 85] }],
    axes: ['TypeScript', 'Angular', 'CSS', 'Testing', 'Architecture'],
    size: 300,
    fillOpacity: 0.25,
  },
};

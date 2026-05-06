import type { Meta, StoryObj } from '@storybook/angular';
import { SliderComponent } from './slider.component';

const meta: Meta<SliderComponent> = {
  title: 'Form/Slider',
  component: SliderComponent,
  argTypes: {
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    showValue: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<SliderComponent>;

export const Default: Story = {
  args: { min: 0, max: 100, step: 1, label: 'Volume', showValue: true, disabled: false },
};

export const WithStep: Story = {
  args: { min: 0, max: 100, step: 10, label: 'Brightness', showValue: true },
};

export const Disabled: Story = {
  args: { min: 0, max: 100, step: 1, label: 'Locked', showValue: true, disabled: true },
};

export const NoLabel: Story = {
  args: { min: 0, max: 50, step: 1, showValue: true },
};

export const NoValue: Story = {
  args: { min: 0, max: 100, step: 1, label: 'Secret', showValue: false },
};

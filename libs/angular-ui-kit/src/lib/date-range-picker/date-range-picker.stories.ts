import type { Meta, StoryObj } from '@storybook/angular';
import { DateRangePickerComponent } from './date-range-picker.component';

const meta: Meta<DateRangePickerComponent> = {
  title: 'Components/Date Range Picker',
  component: DateRangePickerComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Date range picker with calendar dropdown for selecting a start and end date. ' +
          'Supports min/max date constraints, month navigation, range highlighting, ' +
          'and ControlValueAccessor for reactive forms.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<DateRangePickerComponent>;

export const Default: Story = {
  args: {
    label: 'Date range',
    placeholder: 'Select date range',
  },
};

export const WithMinMax: Story = {
  args: {
    label: 'Booking period',
    minDate: new Date(),
    maxDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  },
};

export const Disabled: Story = {
  args: {
    label: 'Locked range',
    disabled: true,
  },
};

export const NoLabel: Story = {
  args: {
    placeholder: 'Pick dates…',
  },
};

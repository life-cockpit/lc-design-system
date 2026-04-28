import type { Meta, StoryObj } from '@storybook/angular';
import { fn, expect, userEvent, within } from 'storybook/test';
import { DatepickerComponent } from './datepicker.component';

/**
 * A date selection input with a dropdown calendar. Supports date formatting,
 * min/max date constraints, disabled dates, weekend disabling, and both
 * outline and filled visual variants.
 */
const meta: Meta<DatepickerComponent> = {
  title: 'Form/Datepicker',
  component: DatepickerComponent,
  tags: ['autodocs'],
  args: {
    dateChange: fn(),
    opened: fn(),
    closed: fn(),
  },
  argTypes: {
    dateChange: { action: 'dateChange', description: 'Emitted when a date is selected (Date | null)' },
    opened: { action: 'opened', description: 'Emitted when the calendar dropdown opens' },
    closed: { action: 'closed', description: 'Emitted when the calendar dropdown closes' },
    variant: {
      control: 'select',
      options: ['outline', 'filled'],
      description: 'Visual style of the input field',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      description: 'Input field size',
    },
    placeholder: { description: 'Placeholder text when no date is selected' },
    format: { description: 'Date display format (e.g. YYYY-MM-DD, DD/MM/YYYY)' },
    helperText: { description: 'Help text displayed below the input' },
    error: { description: 'Shows error styling' },
    errorMessage: { description: 'Error message displayed below the input' },
    disabled: { description: 'Prevents interaction' },
    readonly: { description: 'Shows value but prevents editing' },
    required: { description: 'Marks the field as required' },
    disableWeekends: { description: 'Prevents selecting Saturday/Sunday' },
  },
};

export default meta;
type Story = StoryObj<DatepickerComponent>;

export const Default: Story = {
  args: { variant: 'outline', size: 'md', placeholder: 'Select a date' },
};

export const FilledVariant: Story = {
  name: 'Filled Variant',
  args: { variant: 'filled', size: 'md', placeholder: 'Select a date' },
};

export const WithHelperText: Story = {
  name: 'With Helper Text',
  args: { variant: 'outline', size: 'md', placeholder: 'Select a date', helperText: 'Choose your preferred start date' },
};

export const WithError: Story = {
  name: 'Error State',
  args: { variant: 'outline', size: 'md', placeholder: 'Select a date', error: true, errorMessage: 'Start date must be in the future' },
};

export const Required: Story = {
  args: { variant: 'outline', size: 'md', placeholder: 'Select a date', required: true },
};

export const Disabled: Story = {
  args: { variant: 'outline', size: 'md', placeholder: 'No date available', disabled: true },
};

export const DisableWeekends: Story = {
  name: 'Weekends Disabled',
  args: { variant: 'outline', size: 'md', placeholder: 'Select a weekday', disableWeekends: true, helperText: 'Only business days are selectable' },
};

export const Sizes: Story = {
  name: 'Size Comparison',
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 300px;">
        <lc-datepicker size="xs" placeholder="Extra small"></lc-datepicker>
        <lc-datepicker size="sm" placeholder="Small"></lc-datepicker>
        <lc-datepicker size="md" placeholder="Medium (default)"></lc-datepicker>
        <lc-datepicker size="lg" placeholder="Large"></lc-datepicker>
      </div>`,
  }),
};

export const BookingForm: Story = {
  name: 'Booking Form (Composition)',
  render: () => ({
    template: `
      <div style="max-width: 380px;">
        <h4 style="margin: 0 0 16px; font-weight: 600;">Book a Meeting</h4>
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <lc-datepicker
            placeholder="Select date"
            helperText="Available Monday through Friday"
            [disableWeekends]="true"
            [required]="true"
          ></lc-datepicker>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <lc-datepicker
              placeholder="Start time"
              size="sm"
            ></lc-datepicker>
            <lc-datepicker
              placeholder="End time"
              size="sm"
            ></lc-datepicker>
          </div>
        </div>
      </div>`,
  }),
};

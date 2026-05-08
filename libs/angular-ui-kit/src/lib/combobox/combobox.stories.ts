import type { Meta, StoryObj } from '@storybook/angular';
import { ComboboxComponent, ComboboxOption } from './combobox.component';

const meta: Meta<ComboboxComponent> = {
  title: 'Form/Combobox',
  component: ComboboxComponent,
  parameters: {
    docs: {
      description: {
        component: `
The Combobox component combines a free-text input with a dropdown
of suggestions. Supports sync and async option loading, single/multiple
selection, create-new entries, grouped options, and keyboard navigation.
        `,
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    multiple: { control: 'boolean' },
    allowCreate: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<ComboboxComponent>;

const fruitOptions: ComboboxOption[] = [
  { value: 'apple', label: 'Apple', description: 'A sweet red fruit' },
  { value: 'banana', label: 'Banana', description: 'A curved yellow fruit' },
  { value: 'cherry', label: 'Cherry', description: 'A small red stone fruit' },
  { value: 'date', label: 'Date', description: 'A sweet brown fruit' },
  { value: 'elderberry', label: 'Elderberry' },
  { value: 'fig', label: 'Fig' },
  { value: 'grape', label: 'Grape' },
  { value: 'honeydew', label: 'Honeydew' },
];

const groupedOptions: ComboboxOption[] = [
  { value: 'apple', label: 'Apple', group: 'Fruits' },
  { value: 'banana', label: 'Banana', group: 'Fruits' },
  { value: 'carrot', label: 'Carrot', group: 'Vegetables' },
  { value: 'broccoli', label: 'Broccoli', group: 'Vegetables' },
  { value: 'salmon', label: 'Salmon', group: 'Protein' },
  { value: 'chicken', label: 'Chicken', group: 'Protein' },
];

const iconOptions: ComboboxOption[] = [
  { value: 'home', label: 'Dashboard', icon: 'home', description: 'Go to dashboard' },
  { value: 'users', label: 'Team Members', icon: 'users', description: 'Manage team' },
  { value: 'cog', label: 'Settings', icon: 'cog-6-tooth', description: 'App settings' },
  { value: 'doc', label: 'Documents', icon: 'document-text', description: 'View documents' },
];

export const Default: Story = {
  args: {
    options: fruitOptions,
    label: 'Select a fruit',
    placeholder: 'Type to search...',
    helperText: 'Start typing to filter options',
  },
};

export const Multiple: Story = {
  args: {
    options: fruitOptions,
    label: 'Select fruits',
    placeholder: 'Add fruits...',
    multiple: true,
  },
  parameters: {
    docs: { description: { story: 'Multiple selection shows chips for selected items.' } },
  },
};

export const AllowCreate: Story = {
  args: {
    options: fruitOptions,
    label: 'Tags',
    placeholder: 'Add or create tags...',
    multiple: true,
    allowCreate: true,
    emptyMessage: 'No tags found — press Enter to create',
  },
  parameters: {
    docs: { description: { story: 'allowCreate shows a "Create" option when no exact match exists.' } },
  },
};

export const Grouped: Story = {
  args: {
    options: groupedOptions,
    label: 'Pick an ingredient',
    placeholder: 'Search ingredients...',
  },
  parameters: {
    docs: { description: { story: 'Options grouped by category with section headers.' } },
  },
};

export const WithIcons: Story = {
  args: {
    options: iconOptions,
    label: 'Navigate to',
    placeholder: 'Search pages...',
  },
  parameters: {
    docs: { description: { story: 'Options with icons and descriptions.' } },
  },
};

export const WithError: Story = {
  args: {
    options: fruitOptions,
    label: 'Required field',
    error: 'Please select at least one option',
  },
  parameters: {
    docs: { description: { story: 'Error state with validation message.' } },
  },
};

export const Disabled: Story = {
  args: {
    options: fruitOptions,
    label: 'Disabled combobox',
    disabled: true,
    placeholder: 'Cannot interact',
  },
};

export const Sizes: Story = {
  render: () => ({
    props: { options: fruitOptions },
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 400px;">
        <lc-combobox [options]="options" label="Extra Small" size="xs" placeholder="xs size" />
        <lc-combobox [options]="options" label="Small" size="sm" placeholder="sm size" />
        <lc-combobox [options]="options" label="Medium (default)" size="md" placeholder="md size" />
        <lc-combobox [options]="options" label="Large" size="lg" placeholder="lg size" />
      </div>`,
  }),
  parameters: {
    docs: { description: { story: 'Four size presets.' } },
  },
};

import type { Meta, StoryObj } from '@storybook/angular';
import { TagInputComponent } from './tag-input.component';

const meta: Meta<TagInputComponent> = {
  title: 'Components/Tag Input',
  component: TagInputComponent,
  tags: ['autodocs'],
  argTypes: {
    separator: { control: 'radio', options: ['enter', 'comma', 'both'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Tag input component for entering and managing multiple tags. ' +
          'Supports Enter/comma separators, duplicate prevention, max limit, ' +
          'suggestions dropdown, and ControlValueAccessor for forms.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<TagInputComponent>;

export const Default: Story = {
  args: {
    placeholder: 'Add a tag…',
    label: 'Tags',
  },
};

export const WithMaxTags: Story = {
  args: {
    placeholder: 'Max 3 tags…',
    maxTags: 3,
    label: 'Limited Tags',
  },
};

export const WithSuggestions: Story = {
  args: {
    placeholder: 'Start typing…',
    suggestions: ['Angular', 'React', 'Vue', 'Svelte', 'SolidJS', 'Qwik', 'Ember', 'Preact'],
    label: 'Framework',
  },
};

export const AllowDuplicates: Story = {
  args: {
    placeholder: 'Duplicates allowed…',
    allowDuplicates: true,
  },
};

export const NotRemovable: Story = {
  args: {
    removable: false,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Disabled',
  },
};

import type { Meta, StoryObj } from '@storybook/angular';
import { AvatarGroupComponent } from './avatar-group.component';

const meta: Meta<AvatarGroupComponent> = {
  title: 'Data Display/Avatar Group',
  component: AvatarGroupComponent,
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    max: { control: 'number' },
  },

  parameters: {
    docs: {
      description: {
        component: `
Avatar group component for displaying multiple user avatars.

**Key Features:**
- Overlapping avatar display with configurable max visible count
- Overflow indicator showing remaining count
- Shared size variant across all avatars (xs, sm, md, lg)
- Automatic truncation based on max property
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<AvatarGroupComponent>;

const teamMembers = [
  { name: 'Alice Anders' },
  { name: 'Bob Bauer' },
  { name: 'Charlie Chen' },
  { name: 'Diana Dietrich' },
  { name: 'Erik Engel' },
  { name: 'Fiona Fischer' },
  { name: 'Georg Gross' },
];

export const Default: Story = {
  args: { avatars: teamMembers, size: 'md', max: 5 },
};

export const Small: Story = {
  args: { avatars: teamMembers.slice(0, 4), size: 'sm', max: 4 },
};

export const Large: Story = {
  args: { avatars: teamMembers, size: 'lg', max: 4 },
};

export const NoOverflow: Story = {
  args: { avatars: teamMembers.slice(0, 3), size: 'md', max: 5 },
};

export const WithImages: Story = {
  args: {
    avatars: [
      { name: 'Alice', src: 'https://i.pravatar.cc/100?img=1', alt: 'Alice' },
      { name: 'Bob', src: 'https://i.pravatar.cc/100?img=2', alt: 'Bob' },
      { name: 'Charlie', src: 'https://i.pravatar.cc/100?img=3', alt: 'Charlie' },
      { name: 'Diana', src: 'https://i.pravatar.cc/100?img=4', alt: 'Diana' },
      { name: 'Erik', src: 'https://i.pravatar.cc/100?img=5', alt: 'Erik' },
    ],
    size: 'lg',
    max: 4,
  },
};

import type { Meta, StoryObj } from '@storybook/angular';
import { AvatarComponent } from './avatar.component';

/**
 * Avatars represent users or entities with initials, images, or status indicators.
 * Used in headers, comments, team lists, and anywhere you need to identify a person.
 */
const meta: Meta<AvatarComponent> = {
  title: 'Data Display/Avatar',
  component: AvatarComponent,
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Controls the avatar dimensions from 24px (xs) to 64px (xl)',
    },
    status: {
      control: 'select',
      options: [undefined, 'online', 'offline', 'away', 'busy'],
      description: 'Shows a colored dot indicator for user presence',
    },
    name: { description: 'Full name — initials are extracted automatically (e.g. "John Doe" → "JD")' },
    src: { description: 'URL for the avatar image. Falls back to initials if the image fails to load' },
  },
};

export default meta;
type Story = StoryObj<AvatarComponent>;

export const WithInitials: Story = {
  name: 'Initials',
  args: { name: 'Sarah Connor', size: 'md' },
};

export const WithImage: Story = {
  name: 'Image',
  args: { src: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', alt: 'Sarah Connor', name: 'Sarah Connor', size: 'md' },
};

export const OnlineStatus: Story = {
  args: { name: 'David Park', size: 'md', status: 'online' },
};

export const BusyStatus: Story = {
  args: { name: 'Maria Garcia', size: 'md', status: 'busy' },
};

export const AllSizes: Story = {
  name: 'Size Comparison',
  render: () => ({
    template: `
      <div style="display: flex; align-items: center; gap: 16px;">
        <div style="text-align: center;">
          <lc-avatar name="Anna Bell" size="xs"></lc-avatar>
          <div style="margin-top: 4px; font-size: 11px; color: #666;">xs</div>
        </div>
        <div style="text-align: center;">
          <lc-avatar name="Ben Carter" size="sm"></lc-avatar>
          <div style="margin-top: 4px; font-size: 11px; color: #666;">sm</div>
        </div>
        <div style="text-align: center;">
          <lc-avatar name="Clara Davis" size="md"></lc-avatar>
          <div style="margin-top: 4px; font-size: 11px; color: #666;">md</div>
        </div>
        <div style="text-align: center;">
          <lc-avatar name="Daniel Evans" size="lg"></lc-avatar>
          <div style="margin-top: 4px; font-size: 11px; color: #666;">lg</div>
        </div>
        <div style="text-align: center;">
          <lc-avatar name="Emma Fischer" size="xl"></lc-avatar>
          <div style="margin-top: 4px; font-size: 11px; color: #666;">xl</div>
        </div>
      </div>`,
  }),
};

export const StatusVariants: Story = {
  name: 'All Status Indicators',
  render: () => ({
    template: `
      <div style="display: flex; align-items: center; gap: 24px;">
        <div style="text-align: center;">
          <lc-avatar name="Online User" size="lg" status="online"></lc-avatar>
          <div style="margin-top: 8px; font-size: 12px; color: #666;">Online</div>
        </div>
        <div style="text-align: center;">
          <lc-avatar name="Away User" size="lg" status="away"></lc-avatar>
          <div style="margin-top: 8px; font-size: 12px; color: #666;">Away</div>
        </div>
        <div style="text-align: center;">
          <lc-avatar name="Busy User" size="lg" status="busy"></lc-avatar>
          <div style="margin-top: 8px; font-size: 12px; color: #666;">Busy</div>
        </div>
        <div style="text-align: center;">
          <lc-avatar name="Offline User" size="lg" status="offline"></lc-avatar>
          <div style="margin-top: 8px; font-size: 12px; color: #666;">Offline</div>
        </div>
      </div>`,
  }),
};

export const TeamList: Story = {
  name: 'Team Members (Composition)',
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; max-width: 320px;">
        <div style="display: flex; align-items: center; gap: 12px; padding: 8px;">
          <lc-avatar name="Alice Johnson" size="md" status="online"></lc-avatar>
          <div>
            <div style="font-weight: 500;">Alice Johnson</div>
            <div style="font-size: 12px; color: #666;">Product Manager</div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 12px; padding: 8px;">
          <lc-avatar name="Bob Williams" size="md" status="busy"></lc-avatar>
          <div>
            <div style="font-weight: 500;">Bob Williams</div>
            <div style="font-size: 12px; color: #666;">Senior Engineer</div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 12px; padding: 8px;">
          <lc-avatar name="Carol Martinez" size="md" status="away"></lc-avatar>
          <div>
            <div style="font-weight: 500;">Carol Martinez</div>
            <div style="font-size: 12px; color: #666;">UX Designer</div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 12px; padding: 8px;">
          <lc-avatar name="Dan Lee" size="md" status="offline"></lc-avatar>
          <div>
            <div style="font-weight: 500;">Dan Lee</div>
            <div style="font-size: 12px; color: #666;">QA Engineer</div>
          </div>
        </div>
      </div>`,
  }),
};

export const AvatarStack: Story = {
  name: 'Stacked Avatars',
  render: () => ({
    template: `
      <div style="display: flex;">
        <lc-avatar name="User One" size="md" style="margin-left: 0; border: 2px solid white; border-radius: 50%;"></lc-avatar>
        <lc-avatar name="User Two" size="md" style="margin-left: -8px; border: 2px solid white; border-radius: 50%;"></lc-avatar>
        <lc-avatar name="User Three" size="md" style="margin-left: -8px; border: 2px solid white; border-radius: 50%;"></lc-avatar>
        <lc-avatar name="+5" size="md" style="margin-left: -8px; border: 2px solid white; border-radius: 50%;"></lc-avatar>
      </div>`,
  }),
};

import type { Meta, StoryObj } from '@storybook/angular';
import { fn, expect, userEvent, within } from 'storybook/test';
import { SidenavComponent } from './sidenav.component';

/**
 * Sidenav provides a vertical navigation panel for application-level routing.
 * Supports docked (always visible) and drawer (overlay) modes with left/right
 * positioning. Items can have icons, nested children, and active state highlighting.
 */
const meta: Meta<SidenavComponent> = {
  title: 'Navigation/Sidenav',
  component: SidenavComponent,
  tags: ['autodocs'],
  args: {
    closed: fn(),
    itemClicked: fn(),
  },
  argTypes: {
    closed: { action: 'closed', description: 'Emitted when the sidenav is closed (drawer mode)' },
    itemClicked: { action: 'itemClicked', description: 'Emitted with the NavigationItem when an item is clicked' },
    modeInput: {
      control: 'select',
      options: ['drawer', 'docked'],
      description: 'Docked stays visible, drawer overlays content',
    },
    positionInput: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Which side of the viewport the nav appears on',
    },
    isOpenInput: { description: 'Whether the sidenav is currently visible' },
    activeRouteInput: { description: 'The currently active route (highlights matching item)' },
    widthInput: { description: 'Custom width (CSS value, e.g. "280px")' },
  },
};

export default meta;
type Story = StoryObj<SidenavComponent>;

const standardItems = [
  { id: '1', icon: 'home', label: 'Dashboard', route: '/dashboard', displayOrder: 1 },
  { id: '2', icon: 'folder', label: 'Projects', route: '/projects', displayOrder: 2 },
  { id: '3', icon: 'users', label: 'Team', route: '/team', displayOrder: 3 },
  { id: '4', icon: 'chart-bar', label: 'Analytics', route: '/analytics', displayOrder: 4 },
  { id: '5', icon: 'cog-6-tooth', label: 'Settings', route: '/settings', displayOrder: 5 },
];

export const Docked: Story = {
  name: 'Docked Mode',
  args: {
    isOpenInput: true,
    modeInput: 'docked',
    itemsInput: standardItems,
    activeRouteInput: '/dashboard',
  },
};

export const DrawerMode: Story = {
  name: 'Drawer Mode',
  args: {
    isOpenInput: true,
    modeInput: 'drawer',
    itemsInput: standardItems,
    activeRouteInput: '/projects',
  },
};

export const RightPosition: Story = {
  name: 'Right Position',
  args: {
    isOpenInput: true,
    modeInput: 'docked',
    positionInput: 'right',
    itemsInput: standardItems,
    activeRouteInput: '/team',
  },
};

export const WithNestedItems: Story = {
  name: 'With Nested Children',
  args: {
    isOpenInput: true,
    modeInput: 'docked',
    itemsInput: [
      { id: '1', icon: 'home', label: 'Dashboard', route: '/dashboard', displayOrder: 1 },
      { id: '2', icon: 'folder', label: 'Projects', route: '/projects', displayOrder: 2, children: [
        { id: '2a', icon: 'document', label: 'Active', route: '/projects/active', displayOrder: 1 },
        { id: '2b', icon: 'archive-box', label: 'Archived', route: '/projects/archived', displayOrder: 2 },
      ]},
      { id: '3', icon: 'users', label: 'Team', route: '/team', displayOrder: 3, children: [
        { id: '3a', icon: 'user-plus', label: 'Members', route: '/team/members', displayOrder: 1 },
        { id: '3b', icon: 'shield-check', label: 'Roles', route: '/team/roles', displayOrder: 2 },
      ]},
      { id: '4', icon: 'cog-6-tooth', label: 'Settings', route: '/settings', displayOrder: 4 },
    ],
    activeRouteInput: '/projects/active',
  },
};

export const FullApplication: Story = {
  name: 'Full App Layout (Composition)',
  args: {
    isOpenInput: true,
    modeInput: 'docked',
    itemsInput: [
      { id: '1', icon: 'home', label: 'Home', route: '/', displayOrder: 1 },
      { id: '2', icon: 'clipboard-document-list', label: 'Tasks', route: '/tasks', displayOrder: 2 },
      { id: '3', icon: 'calendar', label: 'Calendar', route: '/calendar', displayOrder: 3 },
      { id: '4', icon: 'chart-bar', label: 'Reports', route: '/reports', displayOrder: 4 },
      { id: '5', icon: 'bell', label: 'Notifications', route: '/notifications', displayOrder: 5 },
      { id: '6', icon: 'cog-6-tooth', label: 'Settings', route: '/settings', displayOrder: 6 },
    ],
    activeRouteInput: '/tasks',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="display: flex; height: 400px; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
        <lc-sidenav [isOpenInput]="isOpenInput" [modeInput]="modeInput" [itemsInput]="itemsInput" [activeRouteInput]="activeRouteInput"></lc-sidenav>
        <div style="flex: 1; padding: 24px;">
          <h3 style="margin: 0 0 8px; font-weight: 600;">Tasks</h3>
          <p style="color: #666; font-size: 14px;">Main content area next to the sidenav.</p>
        </div>
      </div>`,
  }),
};

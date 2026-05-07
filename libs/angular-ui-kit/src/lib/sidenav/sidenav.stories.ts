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
    themeInput: {
      control: 'select',
      options: ['auto', 'light', 'dark'],
      description: 'Theme variant — sets internal tokens (--lc-sidenav-bg, --lc-sidenav-fg, etc.)',
    },
  },

  parameters: {
    docs: {
      description: {
        component: `
Sidenav component for application navigation sidebar.

**Key Features:**
- Drawer (overlay) and docked (persistent) modes
- Collapsed icon-rail mode (56px narrow sidebar with icons only and hover tooltips)
- Hierarchical navigation with collapsible groups
- Section headlines for item grouping
- Active route highlighting
- Keyboard navigation support
- Configurable width and position (left/right)
- Optional backdrop overlay
- \`theme\` input (\`auto\` | \`light\` | \`dark\`) with internal CSS tokens
- Accessible with ARIA navigation role

**Theming Tokens:** \`--lc-sidenav-bg\`, \`--lc-sidenav-fg\`, \`--lc-sidenav-fg-active\`, \`--lc-sidenav-border\`, \`--lc-sidenav-hover-bg\`, \`--lc-sidenav-section-fg\`
`,
      },
    },
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

export const CollapsedIconRail: Story = {
  name: 'Collapsed Icon Rail',
  parameters: {
    docs: { description: { story: 'Collapsed mode shows only icons in a narrow 56px rail. Hover over an icon to see the label tooltip.' } },
  },
  args: {
    isOpenInput: true,
    modeInput: 'docked',
    collapsedInput: true,
    itemsInput: standardItems,
    activeRouteInput: '/dashboard',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="display: flex; height: 400px; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
        <lc-sidenav [isOpenInput]="isOpenInput" [modeInput]="modeInput" [collapsedInput]="collapsedInput" [itemsInput]="itemsInput" [activeRouteInput]="activeRouteInput"></lc-sidenav>
        <div style="flex: 1; padding: 24px;">
          <h3 style="margin: 0 0 8px; font-weight: 600;">Dashboard</h3>
          <p style="color: #666; font-size: 14px;">The sidenav is collapsed to a narrow icon rail. Hover icons for labels.</p>
        </div>
      </div>`,
  }),
};

export const CollapsedVsExpanded: Story = {
  name: 'Collapsed vs Expanded',
  parameters: {
    docs: { description: { story: 'Side-by-side comparison of collapsed icon rail and full expanded sidenav.' } },
  },
  render: () => ({
    template: `
      <div style="display: flex; gap: 24px;">
        <div style="display: flex; height: 400px; border: 1px solid #eee; border-radius: 8px; overflow: hidden; flex: 0 0 auto;">
          <lc-sidenav [isOpenInput]="true" modeInput="docked" [collapsedInput]="true"
            [itemsInput]="[
              { id: '1', icon: 'home', label: 'Dashboard', route: '/dashboard', displayOrder: 1 },
              { id: '2', icon: 'folder', label: 'Projects', route: '/projects', displayOrder: 2 },
              { id: '3', icon: 'users', label: 'Team', route: '/team', displayOrder: 3 },
              { id: '4', icon: 'chart-bar', label: 'Analytics', route: '/analytics', displayOrder: 4 },
              { id: '5', icon: 'cog-6-tooth', label: 'Settings', route: '/settings', displayOrder: 5 }
            ]"
            activeRouteInput="/dashboard">
          </lc-sidenav>
          <div style="padding: 16px; font-size: 13px; color: #999;">Collapsed</div>
        </div>
        <div style="display: flex; height: 400px; border: 1px solid #eee; border-radius: 8px; overflow: hidden; flex: 1;">
          <lc-sidenav [isOpenInput]="true" modeInput="docked" [collapsedInput]="false" widthInput="240px"
            [itemsInput]="[
              { id: '1', icon: 'home', label: 'Dashboard', route: '/dashboard', displayOrder: 1 },
              { id: '2', icon: 'folder', label: 'Projects', route: '/projects', displayOrder: 2 },
              { id: '3', icon: 'users', label: 'Team', route: '/team', displayOrder: 3 },
              { id: '4', icon: 'chart-bar', label: 'Analytics', route: '/analytics', displayOrder: 4 },
              { id: '5', icon: 'cog-6-tooth', label: 'Settings', route: '/settings', displayOrder: 5 }
            ]"
            activeRouteInput="/dashboard">
          </lc-sidenav>
          <div style="padding: 16px; font-size: 13px; color: #999; flex: 1;">Expanded</div>
        </div>
      </div>`,
  }),
};

export const DarkTheme: Story = {
  name: 'Dark Theme',
  parameters: {
    docs: { description: { story: 'Sidenav with explicit dark theme via `[theme]="dark"`. Uses internal tokens for background, text, and hover colors.' } },
  },
  args: {
    isOpenInput: true,
    modeInput: 'docked',
    themeInput: 'dark',
    itemsInput: standardItems,
    activeRouteInput: '/dashboard',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="display: flex; height: 400px; border: 1px solid #333; border-radius: 8px; overflow: hidden;">
        <lc-sidenav [isOpenInput]="isOpenInput" [modeInput]="modeInput" [theme]="themeInput" [itemsInput]="itemsInput" [activeRouteInput]="activeRouteInput"></lc-sidenav>
        <div style="flex: 1; padding: 24px; background: #f9fafb;">
          <h3 style="margin: 0 0 8px; font-weight: 600;">Content Area</h3>
          <p style="color: #666; font-size: 14px;">The sidenav uses its own dark tokens, independent of the page theme.</p>
        </div>
      </div>`,
  }),
};

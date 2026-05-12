import type { Meta, StoryObj } from '@storybook/angular';
import { fn, expect, userEvent, within } from 'storybook/test';
import { SidenavComponent } from './sidenav.component';
import { HeaderComponent } from '../header/header.component';

/**
 * Sidenav provides a vertical navigation panel for application-level routing.
 * Supports docked (always visible) and drawer (overlay) modes with left/right
 * positioning. Items can have icons, nested children, active state highlighting,
 * action buttons, badges, and an integrated logo header.
 */
const meta: Meta<SidenavComponent> = {
  title: 'Navigation/Sidenav',
  component: SidenavComponent,
  args: {
    closed: fn(),
    itemClicked: fn(),
    itemAction: fn(),
  },
  argTypes: {
    closed: { action: 'closed', description: 'Emitted when the sidenav is closed (drawer mode)' },
    itemClicked: { action: 'itemClicked', description: 'Emitted with the NavigationItem when an item is clicked' },
    itemAction: { action: 'itemAction', description: 'Emitted with the NavigationItem when an action button is clicked' },
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
    showLogoInput: { description: 'Show the logo at the top of the sidenav (for sidebar-first layouts)' },
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

export const WithGroupsAndActions: Story = {
  name: 'Groups with Actions',
  parameters: {
    docs: { description: { story: 'Section headers and collapsible items can have action buttons (visible on hover). Useful for "Add project", context menus, etc.' } },
  },
  args: {
    isOpenInput: true,
    modeInput: 'docked',
    themeInput: 'dark',
    itemsInput: [
      { id: '1', icon: 'chart-bar', label: 'Dashboard', route: '/dashboard', displayOrder: 1 },
      { id: '2', icon: 'cpu-chip', label: 'Agent Runs', route: '/agent-runs', displayOrder: 2 },
      {
        id: 'projects-section', icon: '', label: 'Projects', route: '', displayOrder: 3,
        isSection: true,
        action: { icon: 'plus', ariaLabel: 'Add project' },
        children: [
          {
            id: 'p1', icon: 'folder', label: 'Project Alpha', route: '/projects/alpha', displayOrder: 1,
            action: { icon: 'ellipsis-horizontal', ariaLabel: 'Project Alpha options' },
            children: [
              { id: 'p1a', icon: 'clipboard-document-list', label: 'Specs & Epics', route: '/projects/alpha/specs', displayOrder: 1 },
              { id: 'p1b', icon: 'building-library', label: 'ADRs', route: '/projects/alpha/adrs', displayOrder: 2 },
              { id: 'p1c', icon: 'document-text', label: 'Policies', route: '/projects/alpha/policies', displayOrder: 3 },
              { id: 'p1d', icon: 'link', label: 'Context Sources', route: '/projects/alpha/context', displayOrder: 4 },
              { id: 'p1e', icon: 'chart-bar-square', label: 'Metrics', route: '/projects/alpha/metrics', displayOrder: 5 },
            ],
          },
          {
            id: 'p2', icon: 'folder', label: 'Project Beta', route: '/projects/beta', displayOrder: 2,
            action: { icon: 'ellipsis-horizontal', ariaLabel: 'Project Beta options' },
            children: [
              { id: 'p2a', icon: 'clipboard-document-list', label: 'Specs & Epics', route: '/projects/beta/specs', displayOrder: 1 },
            ],
          },
          {
            id: 'p3', icon: 'folder', label: 'Project Gamma', route: '/projects/gamma', displayOrder: 3,
            action: { icon: 'ellipsis-horizontal', ariaLabel: 'Project Gamma options' },
            children: [
              { id: 'p3a', icon: 'clipboard-document-list', label: 'Specs & Epics', route: '/projects/gamma/specs', displayOrder: 1 },
            ],
          },
        ],
      },
      { id: '10', icon: 'cog-6-tooth', label: 'Org Settings', route: '/settings', displayOrder: 10 },
    ],
    activeRouteInput: '/projects/alpha/specs',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="display: flex; height: 500px; border: 1px solid #333; border-radius: 8px; overflow: hidden;">
        <lc-sidenav [isOpenInput]="isOpenInput" [modeInput]="modeInput" [theme]="themeInput" [itemsInput]="itemsInput" [activeRouteInput]="activeRouteInput" (itemAction)="itemAction($event)"></lc-sidenav>
        <div style="flex: 1; padding: 24px; background: #f9fafb;">
          <h3 style="margin: 0 0 8px; font-weight: 600;">Specs &amp; Epics</h3>
          <p style="color: #666; font-size: 14px;">Hover over section headers or items to see action buttons.</p>
        </div>
      </div>`,
  }),
};

export const WithBadges: Story = {
  name: 'With Badges',
  parameters: {
    docs: { description: { story: 'Navigation items can display a badge with a count or label on the right side. Badges support all color variants.' } },
  },
  args: {
    isOpenInput: true,
    modeInput: 'docked',
    itemsInput: [
      { id: '1', icon: 'home', label: 'Dashboard', route: '/dashboard', displayOrder: 1 },
      { id: '2', icon: 'clipboard-document-list', label: 'Tasks', route: '/tasks', displayOrder: 2, badge: { value: 12, variant: 'primary' } },
      { id: '3', icon: 'bell', label: 'Notifications', route: '/notifications', displayOrder: 3, badge: { value: 3, variant: 'error' } },
      { id: '4', icon: 'envelope', label: 'Messages', route: '/messages', displayOrder: 4, badge: { value: 'New', variant: 'success' } },
      { id: '5', icon: 'users', label: 'Team', route: '/team', displayOrder: 5, children: [
        { id: '5a', icon: 'user-plus', label: 'Pending Invites', route: '/team/invites', displayOrder: 1, badge: { value: 2, variant: 'warning' } },
        { id: '5b', icon: 'shield-check', label: 'Roles', route: '/team/roles', displayOrder: 2 },
      ]},
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
          <p style="color: #666; font-size: 14px;">Items can show badges for counts, status, or labels.</p>
        </div>
      </div>`,
  }),
};

export const CollapsedWithGroups: Story = {
  name: 'Collapsed with Groups & Actions',
  parameters: {
    docs: { description: { story: 'Collapsed icon rail with section groups, collapsible items, actions, and badges. Groups are separated by dividers, labels/chevrons/children are hidden.' } },
  },
  args: {
    isOpenInput: true,
    modeInput: 'docked',
    collapsedInput: true,
    themeInput: 'dark',
    itemsInput: [
      { id: '1', icon: 'chart-bar', label: 'Dashboard', route: '/dashboard', displayOrder: 1 },
      { id: '2', icon: 'cpu-chip', label: 'Agent Runs', route: '/agent-runs', displayOrder: 2, badge: { value: 3, variant: 'primary' } },
      {
        id: 'projects-section', icon: '', label: 'Projects', route: '', displayOrder: 3,
        isSection: true,
        action: { icon: 'plus', ariaLabel: 'Add project' },
        children: [
          { id: 'p1', icon: 'folder', label: 'Project Alpha', route: '/projects/alpha', displayOrder: 1 },
          { id: 'p2', icon: 'folder', label: 'Project Beta', route: '/projects/beta', displayOrder: 2 },
          { id: 'p3', icon: 'folder', label: 'Project Gamma', route: '/projects/gamma', displayOrder: 3 },
        ],
      },
      { id: '10', icon: 'cog-6-tooth', label: 'Org Settings', route: '/settings', displayOrder: 10 },
    ],
    activeRouteInput: '/projects/alpha',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="display: flex; height: 400px; border: 1px solid #333; border-radius: 8px; overflow: hidden;">
        <lc-sidenav [isOpenInput]="isOpenInput" [modeInput]="modeInput" [collapsedInput]="collapsedInput" [theme]="themeInput" [itemsInput]="itemsInput" [activeRouteInput]="activeRouteInput" (itemAction)="itemAction($event)"></lc-sidenav>
        <div style="flex: 1; padding: 24px; background: #f9fafb;">
          <h3 style="margin: 0 0 8px; font-weight: 600;">Project Alpha</h3>
          <p style="color: #666; font-size: 14px;">Collapsed sidenav with section groups. Hover icons for labels.</p>
        </div>
      </div>`,
  }),
};

export const SidebarFirstLayout: Story = {
  name: 'Sidebar-First Layout',
  parameters: {
    docs: { description: { story: 'The sidenav takes full height beside the header. Logo is shown at the top of the sidenav (full when expanded, emblem when collapsed). The header sits only above the content area.' } },
    layout: 'fullscreen',
  },
  render: () => ({
    moduleMetadata: { imports: [HeaderComponent] },
    template: `
      <div style="display: flex; height: 500px; border: 1px solid #333; border-radius: 8px; overflow: hidden;">
        <lc-sidenav
          [isOpenInput]="true"
          modeInput="docked"
          [showLogoInput]="true"
          theme="dark"
          widthInput="240px"
          [itemsInput]="[
            { id: '1', icon: 'chart-bar', label: 'Dashboard', route: '/dashboard', displayOrder: 1 },
            { id: '2', icon: 'cpu-chip', label: 'Agent Runs', route: '/agent-runs', displayOrder: 2, badge: { value: 3, variant: 'primary' } },
            {
              id: 'projects', icon: '', label: 'Projects', route: '', displayOrder: 3,
              isSection: true,
              action: { icon: 'plus', ariaLabel: 'Add project' },
              children: [
                { id: 'p1', icon: 'folder', label: 'Project Alpha', route: '/projects/alpha', displayOrder: 1,
                  action: { icon: 'ellipsis-horizontal', ariaLabel: 'Options' },
                  children: [
                    { id: 'p1a', icon: 'clipboard-document-list', label: 'Specs & Epics', route: '/projects/alpha/specs', displayOrder: 1 },
                    { id: 'p1b', icon: 'building-library', label: 'ADRs', route: '/projects/alpha/adrs', displayOrder: 2 },
                    { id: 'p1c', icon: 'document-text', label: 'Policies', route: '/projects/alpha/policies', displayOrder: 3 }
                  ]
                },
                { id: 'p2', icon: 'folder', label: 'Project Beta', route: '/projects/beta', displayOrder: 2,
                  action: { icon: 'ellipsis-horizontal', ariaLabel: 'Options' } },
                { id: 'p3', icon: 'folder', label: 'Project Gamma', route: '/projects/gamma', displayOrder: 3,
                  action: { icon: 'ellipsis-horizontal', ariaLabel: 'Options' } }
              ]
            },
            { id: '10', icon: 'cog-6-tooth', label: 'Org Settings', route: '/settings', displayOrder: 10 }
          ]"
          activeRouteInput="/projects/alpha/specs">
        </lc-sidenav>
        <div style="display: flex; flex-direction: column; flex: 1; min-width: 0;">
          <lc-header
            title="Life-Cockpit"
            subtitle="Specs & Epics"
            userName="Sarah Connor"
            userEmail="sarah@example.com"
            contextName="Acme Corp"
            contextLabel="Organization"
            [showThemeButton]="true"
            [showLogo]="false"
          ></lc-header>
          <main style="flex: 1; padding: 24px; overflow-y: auto; background: #f9fafb;">
            <h2 style="margin: 0 0 12px; font-weight: 600; font-size: 1.25rem;">Specs & Epics</h2>
            <p style="color: #666; font-size: 14px;">Content area with header above. The sidenav owns the full height and logo. Click the logo to toggle collapsed state.</p>
          </main>
        </div>
      </div>`,
  }),
};

export const SidebarFirstCollapsed: Story = {
  name: 'Sidebar-First Layout (Collapsed)',
  parameters: {
    docs: { description: { story: 'Same sidebar-first layout but with the sidenav collapsed to an icon rail. The logo switches to the emblem automatically.' } },
    layout: 'fullscreen',
  },
  render: () => ({
    moduleMetadata: { imports: [HeaderComponent] },
    template: `
      <div style="display: flex; height: 500px; border: 1px solid #333; border-radius: 8px; overflow: hidden;">
        <lc-sidenav
          [isOpenInput]="true"
          modeInput="docked"
          [showLogoInput]="true"
          [collapsedInput]="true"
          theme="dark"
          [itemsInput]="[
            { id: '1', icon: 'chart-bar', label: 'Dashboard', route: '/dashboard', displayOrder: 1 },
            { id: '2', icon: 'cpu-chip', label: 'Agent Runs', route: '/agent-runs', displayOrder: 2, badge: { value: 3, variant: 'primary' } },
            {
              id: 'projects', icon: '', label: 'Projects', route: '', displayOrder: 3,
              isSection: true,
              children: [
                { id: 'p1', icon: 'folder', label: 'Project Alpha', route: '/projects/alpha', displayOrder: 1 },
                { id: 'p2', icon: 'folder', label: 'Project Beta', route: '/projects/beta', displayOrder: 2 },
                { id: 'p3', icon: 'folder', label: 'Project Gamma', route: '/projects/gamma', displayOrder: 3 }
              ]
            },
            { id: '10', icon: 'cog-6-tooth', label: 'Org Settings', route: '/settings', displayOrder: 10 }
          ]"
          activeRouteInput="/projects/alpha">
        </lc-sidenav>
        <div style="display: flex; flex-direction: column; flex: 1; min-width: 0;">
          <lc-header
            title="Life-Cockpit"
            userName="Sarah Connor"
            userEmail="sarah@example.com"
            contextName="Acme Corp"
            contextLabel="Organization"
            [showThemeButton]="true"
            [showLogo]="false"
          ></lc-header>
          <main style="flex: 1; padding: 24px; overflow-y: auto; background: #f9fafb;">
            <h2 style="margin: 0 0 12px; font-weight: 600; font-size: 1.25rem;">Project Alpha</h2>
            <p style="color: #666; font-size: 14px;">Collapsed sidebar with emblem logo. Click the emblem to expand. Header sits beside the sidenav.</p>
          </main>
        </div>
      </div>`,
  }),
};

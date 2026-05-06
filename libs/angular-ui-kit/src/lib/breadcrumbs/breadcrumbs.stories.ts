import type { Meta, StoryObj } from '@storybook/angular';
import { BreadcrumbsComponent } from './breadcrumbs.component';

/**
 * Breadcrumbs show the user's current location within a navigation hierarchy.
 * Each item except the last is a clickable link. Supports custom separators
 * and multiple sizes.
 */
const meta: Meta<BreadcrumbsComponent> = {
  title: 'Navigation/Breadcrumbs',
  component: BreadcrumbsComponent,
  argTypes: {
    itemsInput: { description: 'Array of breadcrumb items with label and optional url' },
    sizeInput: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Controls font size and spacing',
    },
    separatorInput: { description: 'Character(s) used between items (default: "/")' },
  },

  parameters: {
    docs: {
      description: {
        component: `
Breadcrumbs component for hierarchical navigation.

**Key Features:**
- Configurable separator character
- Ellipsis collapse for long paths with maxItems
- Multiple size variants (sm, md, lg)
- Router link support for navigation items
- Accessible with ARIA breadcrumb landmark
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<BreadcrumbsComponent>;

export const Default: Story = {
  args: {
    itemsInput: [
      { label: 'Home', url: '/' },
      { label: 'Products', url: '/products' },
      { label: 'Shoes', url: '/products/shoes' },
      { label: 'Running' },
    ],
    sizeInput: 'md',
    separatorInput: '/',
  },
};

export const TwoLevels: Story = {
  name: 'Two Levels',
  args: {
    itemsInput: [
      { label: 'Dashboard', url: '/' },
      { label: 'Settings' },
    ],
    sizeInput: 'md',
    separatorInput: '/',
  },
};

export const DeepHierarchy: Story = {
  name: 'Deep Hierarchy',
  args: {
    itemsInput: [
      { label: 'Home', url: '/' },
      { label: 'Organization', url: '/org' },
      { label: 'Teams', url: '/org/teams' },
      { label: 'Engineering', url: '/org/teams/engineering' },
      { label: 'Frontend', url: '/org/teams/engineering/frontend' },
      { label: 'Members' },
    ],
    sizeInput: 'md',
    separatorInput: '/',
  },
};

export const ChevronSeparator: Story = {
  name: 'Chevron Separator',
  args: {
    itemsInput: [
      { label: 'Home', url: '/' },
      { label: 'Projects', url: '/projects' },
      { label: 'Life-Cockpit' },
    ],
    sizeInput: 'md',
    separatorInput: '›',
  },
};

export const ArrowSeparator: Story = {
  name: 'Arrow Separator',
  args: {
    itemsInput: [
      { label: 'Account', url: '/account' },
      { label: 'Billing', url: '/account/billing' },
      { label: 'Invoices' },
    ],
    sizeInput: 'md',
    separatorInput: '→',
  },
};

export const Sizes: Story = {
  name: 'Size Comparison',
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div>
          <div style="font-size: 11px; color: #666; margin-bottom: 4px;">Small</div>
          <lc-breadcrumbs [itemsInput]="items" sizeInput="sm"></lc-breadcrumbs>
        </div>
        <div>
          <div style="font-size: 11px; color: #666; margin-bottom: 4px;">Medium (default)</div>
          <lc-breadcrumbs [itemsInput]="items" sizeInput="md"></lc-breadcrumbs>
        </div>
        <div>
          <div style="font-size: 11px; color: #666; margin-bottom: 4px;">Large</div>
          <lc-breadcrumbs [itemsInput]="items" sizeInput="lg"></lc-breadcrumbs>
        </div>
      </div>`,
    props: {
      items: [
        { label: 'Home', url: '/' },
        { label: 'Documents', url: '/docs' },
        { label: 'Report Q4.pdf' },
      ],
    },
  }),
};

export const InPageHeader: Story = {
  name: 'In Page Header (Composition)',
  render: () => ({
    template: `
      <div style="max-width: 600px; border-bottom: 1px solid #eee; padding-bottom: 16px;">
        <lc-breadcrumbs
          [itemsInput]="items"
          sizeInput="sm"
        ></lc-breadcrumbs>
        <h2 style="margin: 8px 0 4px; font-size: 22px; font-weight: 600;">Project Settings</h2>
        <p style="margin: 0; font-size: 13px; color: #666;">Manage your project configuration and team members.</p>
      </div>`,
    props: {
      items: [
        { label: 'Home', url: '/' },
        { label: 'Projects', url: '/projects' },
        { label: 'Life-Cockpit', url: '/projects/lc' },
        { label: 'Settings' },
      ],
    },
  }),
};

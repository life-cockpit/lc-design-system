import type { Meta, StoryObj } from '@storybook/angular';
import { ListComponent } from './list.component';

/**
 * Lists display a collection of items in vertical or horizontal orientation.
 * Each item can have an icon, label, and optional action. Supports card and
 * default variants with optional dividers. Emits click events for interactive lists.
 */
const meta: Meta<ListComponent> = {
  title: 'Data Display/List',
  component: ListComponent,
  argTypes: {
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      description: 'Layout direction of list items',
    },
    variant: {
      control: 'select',
      options: ['default', 'card'],
      description: 'Visual style — default is flat, card adds background and shadow',
    },
    showDividers: { description: 'Show separator lines between items' },
  },
};

export default meta;
type Story = StoryObj<ListComponent>;

export const Default: Story = {
  args: {
    items: [
      { label: 'Dashboard', icon: 'home' },
      { label: 'Projects', icon: 'folder' },
      { label: 'Team Members', icon: 'users' },
      { label: 'Settings', icon: 'cog-6-tooth' },
    ],
    variant: 'default',
    showDividers: true,
  },
};

export const CardVariant: Story = {
  name: 'Card Variant',
  args: {
    items: [
      { label: 'Quarterly Report', icon: 'document' },
      { label: 'Team Meeting Notes', icon: 'document' },
      { label: 'Product Roadmap', icon: 'document' },
    ],
    variant: 'card',
    showDividers: true,
  },
};

export const WithActions: Story = {
  name: 'With Action Buttons',
  args: {
    items: [
      { label: 'main-branch.yml', icon: 'document', action: 'View' },
      { label: 'deploy-staging.yml', icon: 'document', action: 'View' },
      { label: 'nightly-tests.yml', icon: 'document', action: 'View' },
    ],
    variant: 'default',
    showDividers: true,
  },
};

export const Horizontal: Story = {
  args: {
    items: [
      { label: 'Overview', icon: 'home' },
      { label: 'Analytics', icon: 'chart-bar' },
      { label: 'Reports', icon: 'document' },
      { label: 'Settings', icon: 'cog-6-tooth' },
    ],
    orientation: 'horizontal',
    variant: 'default',
  },
};

export const WithDisabled: Story = {
  name: 'With Disabled Items',
  args: {
    items: [
      { label: 'Active Feature', icon: 'check-circle' },
      { label: 'Beta Feature', icon: 'beaker' },
      { label: 'Coming Soon', icon: 'lock-closed', disabled: true },
      { label: 'Deprecated', icon: 'x-circle', disabled: true },
    ],
    variant: 'default',
    showDividers: true,
  },
};

export const SettingsMenu: Story = {
  name: 'Settings Menu (Composition)',
  args: {
    items: [
      { label: 'General', icon: 'cog-6-tooth', action: '›' },
      { label: 'Notifications', icon: 'bell', action: '›' },
      { label: 'Privacy & Security', icon: 'shield-check', action: '›' },
      { label: 'Billing', icon: 'credit-card', action: '›' },
      { label: 'Integrations', icon: 'puzzle-piece', action: '›' },
      { label: 'Delete Account', icon: 'trash' },
    ],
    variant: 'card',
    showDividers: true,
  },
};

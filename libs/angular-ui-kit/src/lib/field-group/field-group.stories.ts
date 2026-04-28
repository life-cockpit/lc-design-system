import type { Meta, StoryObj } from '@storybook/angular';
import { FieldGroupComponent } from './field-group.component';

/**
 * Field Group displays label-value pairs in a consistent format.
 * Use it for read-only data displays like user profiles, order details,
 * and settings summaries. Supports optional icons and a compact mode.
 */
const meta: Meta<FieldGroupComponent> = {
  title: 'Data Display/Field Group',
  component: FieldGroupComponent,
  tags: ['autodocs'],
  argTypes: {
    label: { description: 'Field label (key)' },
    value: { description: 'Field value displayed next to/below the label' },
    icon: { description: 'Optional icon displayed before the value' },
    iconSize: {
      control: 'select',
      options: ['xs', 'sm', 'md'],
      description: 'Size of the icon',
    },
    compact: { description: 'Compact layout with less spacing' },
  },
};

export default meta;
type Story = StoryObj<FieldGroupComponent>;

export const Default: Story = {
  args: { label: 'Full Name', value: 'Sarah Connor' },
};

export const WithIcon: Story = {
  args: { label: 'Email', value: 'sarah.connor@example.com', icon: 'envelope' },
};

export const Compact: Story = {
  args: { label: 'Status', value: 'Active', compact: true, icon: 'check-circle' },
};

export const UserProfile: Story = {
  name: 'User Profile (Composition)',
  render: () => ({
    template: `
      <div style="max-width: 400px; display: flex; flex-direction: column; gap: 16px;">
        <h4 style="margin: 0; font-weight: 600;">Account Details</h4>
        <lc-field-group label="Full Name" value="Sarah Connor" icon="user"></lc-field-group>
        <lc-field-group label="Email" value="sarah.connor@example.com" icon="envelope"></lc-field-group>
        <lc-field-group label="Phone" value="+1 (555) 123-4567" icon="phone"></lc-field-group>
        <lc-field-group label="Location" value="Los Angeles, CA" icon="map-pin"></lc-field-group>
        <lc-field-group label="Member Since" value="January 2023" icon="calendar"></lc-field-group>
        <lc-field-group label="Plan" value="Professional" icon="credit-card"></lc-field-group>
      </div>`,
  }),
};

export const OrderSummary: Story = {
  name: 'Order Summary (Composition)',
  render: () => ({
    template: `
      <div style="max-width: 360px; border: 1px solid #eee; border-radius: 8px; padding: 20px;">
        <h4 style="margin: 0 0 16px; font-weight: 600;">Order #12847</h4>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <lc-field-group label="Status" value="Shipped" icon="truck" [compact]="true"></lc-field-group>
          <lc-field-group label="Date" value="Dec 15, 2024" [compact]="true"></lc-field-group>
          <lc-field-group label="Items" value="3 items" [compact]="true"></lc-field-group>
          <lc-field-group label="Total" value="$149.99" [compact]="true"></lc-field-group>
          <lc-field-group label="Tracking" value="1Z999AA10123456784" [compact]="true"></lc-field-group>
        </div>
      </div>`,
  }),
};

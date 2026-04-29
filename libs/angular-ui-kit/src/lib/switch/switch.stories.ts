import type { Meta, StoryObj } from '@storybook/angular';
import { fn, expect, userEvent, within } from 'storybook/test';
import { SwitchComponent } from './switch.component';

/**
 * Switches toggle a single setting on or off. They provide immediate feedback
 * and are ideal for preferences, feature flags, and settings panels.
 * Supports multiple color variants, sizes, loading state, and label positioning.
 */
const meta: Meta<SwitchComponent> = {
  title: 'Form/Switch',
  component: SwitchComponent,
  args: {
    checkedChange: fn(),
  },
  argTypes: {
    checkedChange: { action: 'checkedChange', description: 'Emitted when the switch is toggled (new value)' },
    label: { description: 'Text label displayed beside the switch' },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger'],
      description: 'Color variant when the switch is checked',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Controls the dimensions of the switch track and thumb',
    },
    labelPosition: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Whether the label appears before or after the switch',
    },
    checked: { description: 'Whether the switch is currently on' },
    disabled: { description: 'Prevents interaction' },
    loading: { description: 'Shows a loading indicator (e.g. while saving)' },
    required: { description: 'Marks the field as required in forms' },
  },
};

export default meta;
type Story = StoryObj<SwitchComponent>;

export const Default: Story = {
  args: { label: 'Enable notifications', variant: 'primary', size: 'md', checked: false },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const switchEl = canvas.getByRole('switch');
    await userEvent.click(switchEl);
    await expect(args['checkedChange']).toHaveBeenCalled();
  },
};

export const Checked: Story = {
  args: { label: 'Dark mode', variant: 'primary', size: 'md', checked: true },
};

export const Loading: Story = {
  name: 'Loading (Saving)',
  args: { label: 'Auto-sync enabled', variant: 'primary', size: 'md', checked: true, loading: true },
};

export const Disabled: Story = {
  args: { label: 'Admin-only feature', variant: 'primary', size: 'md', disabled: true, checked: false },
};

export const LabelLeft: Story = {
  name: 'Label on Left',
  args: { label: 'Receive marketing emails', variant: 'primary', size: 'md', labelPosition: 'left' },
};

export const AllVariants: Story = {
  name: 'Color Variants',
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <lc-switch label="Primary (default)" variant="primary" [checked]="true"></lc-switch>
        <lc-switch label="Secondary" variant="secondary" [checked]="true"></lc-switch>
        <lc-switch label="Success — feature active" variant="success" [checked]="true"></lc-switch>
        <lc-switch label="Warning — proceed with caution" variant="warning" [checked]="true"></lc-switch>
        <lc-switch label="Danger — destructive action" variant="danger" [checked]="true"></lc-switch>
      </div>`,
  }),
};

export const Sizes: Story = {
  name: 'Size Comparison',
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <lc-switch label="Small" variant="primary" size="sm" [checked]="true"></lc-switch>
        <lc-switch label="Medium (default)" variant="primary" size="md" [checked]="true"></lc-switch>
        <lc-switch label="Large" variant="primary" size="lg" [checked]="true"></lc-switch>
      </div>`,
  }),
};

export const NotificationSettings: Story = {
  name: 'Notification Settings (Composition)',
  render: () => ({
    template: `
      <div style="max-width: 400px;">
        <h4 style="margin: 0 0 16px; font-weight: 600;">Notification Preferences</h4>
        <div style="display: flex; flex-direction: column; gap: 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #eee;">
            <div>
              <div style="font-weight: 500;">Email notifications</div>
              <div style="font-size: 12px; color: #666;">Receive updates about your projects</div>
            </div>
            <lc-switch variant="primary" [checked]="true"></lc-switch>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #eee;">
            <div>
              <div style="font-weight: 500;">Push notifications</div>
              <div style="font-size: 12px; color: #666;">Get notified on your device</div>
            </div>
            <lc-switch variant="primary" [checked]="true"></lc-switch>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #eee;">
            <div>
              <div style="font-weight: 500;">Weekly digest</div>
              <div style="font-size: 12px; color: #666;">Summary of activity every Monday</div>
            </div>
            <lc-switch variant="primary" [checked]="false"></lc-switch>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0;">
            <div>
              <div style="font-weight: 500;">Marketing emails</div>
              <div style="font-size: 12px; color: #666;">Product updates and promotions</div>
            </div>
            <lc-switch variant="primary" [checked]="false"></lc-switch>
          </div>
        </div>
      </div>`,
  }),
};

export const FeatureFlags: Story = {
  name: 'Feature Flags (Composition)',
  render: () => ({
    template: `
      <div style="max-width: 500px;">
        <h4 style="margin: 0 0 4px; font-weight: 600;">Feature Flags</h4>
        <p style="margin: 0 0 16px; font-size: 13px; color: #666;">Toggle experimental features for this environment.</p>
        <div style="display: flex; flex-direction: column; gap: 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #eee;">
            <span style="font-family: monospace; font-size: 13px;">new_dashboard_layout</span>
            <lc-switch variant="success" [checked]="true" size="sm"></lc-switch>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #eee;">
            <span style="font-family: monospace; font-size: 13px;">ai_suggestions</span>
            <lc-switch variant="success" [checked]="true" size="sm"></lc-switch>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #eee;">
            <span style="font-family: monospace; font-size: 13px;">beta_export_v2</span>
            <lc-switch variant="warning" [checked]="false" size="sm"></lc-switch>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0;">
            <span style="font-family: monospace; font-size: 13px;">delete_account_flow</span>
            <lc-switch variant="danger" [checked]="false" size="sm"></lc-switch>
          </div>
        </div>
      </div>`,
  }),
};

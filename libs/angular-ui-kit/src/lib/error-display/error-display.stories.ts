import type { Meta, StoryObj } from '@storybook/angular';
import { ErrorDisplayComponent } from './error-display.component';

/**
 * Error Display shows error, warning, or info messages prominently.
 * Supports dismissible state, auto-dismiss with a timer, and configurable
 * severity levels. Use for API errors, validation summaries, and system alerts.
 */
const meta: Meta<ErrorDisplayComponent> = {
  title: 'Feedback/Error Display',
  component: ErrorDisplayComponent,
  argTypes: {
    title: { description: 'Bold heading text for the error' },
    message: { description: 'Detailed description of the error or action needed' },
    severity: {
      control: 'select',
      options: ['error', 'warning', 'info'],
      description: 'Controls color and icon — error (red), warning (amber), info (blue)',
    },
    dismissible: { description: 'Shows a close button to dismiss the message' },
    showIcon: { description: 'Whether to show the severity icon' },
    autoDismiss: { description: 'Automatically hides after a delay' },
    autoDismissDelay: { description: 'Milliseconds before auto-dismiss (default: 5000)' },
  },
};

export default meta;
type Story = StoryObj<ErrorDisplayComponent>;

export const Error: Story = {
  name: 'Error',
  args: { title: 'Payment failed', message: 'Your card was declined. Please update your payment method and try again.', severity: 'error' },
};

export const Warning: Story = {
  args: { title: 'Session expiring', message: 'Your session will expire in 5 minutes. Save your work to avoid losing changes.', severity: 'warning' },
};

export const Info: Story = {
  args: { title: 'Scheduled maintenance', message: 'The system will be unavailable on Sunday, 2:00–4:00 AM UTC for planned maintenance.', severity: 'info' },
};

export const Dismissible: Story = {
  args: { title: 'Update available', message: 'A new version is available. Refresh to get the latest features.', severity: 'info', dismissible: true },
};

export const WithoutIcon: Story = {
  name: 'Without Icon',
  args: { title: 'Note', message: 'This is a plain message without a severity icon.', severity: 'info', showIcon: false },
};

export const AutoDismiss: Story = {
  name: 'Auto-Dismiss (3s)',
  args: { title: 'Saved successfully', message: 'Your changes have been saved. This message will disappear automatically.', severity: 'info', autoDismiss: true, autoDismissDelay: 3000 },
};

export const AllSeverities: Story = {
  name: 'All Severity Levels',
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; max-width: 500px;">
        <lc-error-display
          title="Error"
          message="Something went critically wrong. Please contact support."
          severity="error"
          [dismissible]="true"
        ></lc-error-display>
        <lc-error-display
          title="Warning"
          message="Your storage is almost full. Consider upgrading your plan."
          severity="warning"
          [dismissible]="true"
        ></lc-error-display>
        <lc-error-display
          title="Info"
          message="New features are available. Check the changelog for details."
          severity="info"
          [dismissible]="true"
        ></lc-error-display>
      </div>`,
  }),
};

export const FormErrors: Story = {
  name: 'Form Validation Summary (Composition)',
  render: () => ({
    template: `
      <div style="max-width: 440px;">
        <lc-error-display
          title="Please fix the following errors"
          message="• Email address is required\n• Password must be at least 8 characters\n• Please accept the terms of service"
          severity="error"
          [showIcon]="true"
        ></lc-error-display>
      </div>`,
  }),
};

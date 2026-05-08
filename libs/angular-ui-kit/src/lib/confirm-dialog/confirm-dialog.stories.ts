import type { Meta, StoryObj } from '@storybook/angular';
import { ConfirmDialogComponent } from './confirm-dialog.component';

const meta: Meta<ConfirmDialogComponent> = {
  title: 'Feedback/ConfirmDialog',
  component: ConfirmDialogComponent,
  parameters: {
    docs: {
      description: {
        component: `
The ConfirmDialog provides a standardized confirmation pattern
built on top of \`<lc-modal>\`. Supports default, destructive, and
warning variants, plus optional text-matching confirmation.

Also available as an imperative service: \`ConfirmService.confirm()\`.
        `,
      },
      story: { inline: false, height: '120px' },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'warning'],
    },
  },
};

export default meta;
type Story = StoryObj<ConfirmDialogComponent>;

export const Default: Story = {
  args: { open: false, title: 'Confirm Action', message: 'Are you sure you want to proceed?', variant: 'default' },
  render: (args) => ({
    props: { ...args, isOpen: false },
    template: `
      <lc-button variant="primary" (click)="isOpen = true">Open Confirm</lc-button>
      <lc-confirm-dialog
        [open]="isOpen"
        [variant]="variant"
        [title]="title"
        [message]="message"
        (confirmed)="isOpen = false"
        (cancelled)="isOpen = false"
      />`,
  }),
};

export const Destructive: Story = {
  args: { open: false, title: 'Delete Project?', message: 'This will permanently delete the project and all associated data. This action cannot be undone.', variant: 'destructive' },
  render: (args) => ({
    props: { ...args, isOpen: false },
    template: `
      <lc-button variant="danger" (click)="isOpen = true">Delete Project...</lc-button>
      <lc-confirm-dialog
        [open]="isOpen"
        variant="destructive"
        [title]="title"
        [message]="message"
        confirmLabel="Delete Forever"
        (confirmed)="isOpen = false"
        (cancelled)="isOpen = false"
      />`,
  }),
  parameters: {
    docs: { description: { story: 'Destructive variant with red confirm button and warning icon.' } },
  },
};

export const Warning: Story = {
  args: { open: false, title: 'Unsaved Changes', message: 'You have unsaved changes. Leaving this page will discard them.', variant: 'warning' },
  render: (args) => ({
    props: { ...args, isOpen: false },
    template: `
      <lc-button variant="outline" (click)="isOpen = true">Leave Page</lc-button>
      <lc-confirm-dialog
        [open]="isOpen"
        variant="warning"
        [title]="title"
        [message]="message"
        confirmLabel="Discard"
        cancelLabel="Stay"
        (confirmed)="isOpen = false"
        (cancelled)="isOpen = false"
      />`,
  }),
  parameters: {
    docs: { description: { story: 'Warning variant for potentially data-losing actions.' } },
  },
};

export const WithTextConfirmation: Story = {
  args: { open: false, title: 'Delete "my-project"?', message: 'This will permanently delete the project.', variant: 'destructive' },
  render: (args) => ({
    props: { ...args, isOpen: false },
    template: `
      <lc-button variant="danger" (click)="isOpen = true">Delete with confirmation...</lc-button>
      <lc-confirm-dialog
        [open]="isOpen"
        variant="destructive"
        [title]="title"
        [message]="message"
        confirmLabel="Delete"
        [requireText]="{ prompt: 'Type the project name to confirm', expected: 'my-project' }"
        (confirmed)="isOpen = false"
        (cancelled)="isOpen = false"
      />`,
  }),
  parameters: {
    docs: { description: { story: 'Double opt-out: confirm button disabled until user types the exact project name.' } },
  },
};

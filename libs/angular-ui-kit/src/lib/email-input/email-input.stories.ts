import type { Meta, StoryObj } from '@storybook/angular';
import { EmailInputComponent } from './email-input.component';

/**
 * A specialized input for email addresses with built-in validation.
 * Validates email format on input or blur and provides clear error feedback.
 * Supports all standard input states (disabled, readonly, required, error).
 */
const meta: Meta<EmailInputComponent> = {
  title: 'Form/Email Input',
  component: EmailInputComponent,
  argTypes: {
    label: { description: 'Label text above the input' },
    placeholder: { description: 'Placeholder text (default: "you@example.com")' },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      description: 'Controls input height and font size',
    },
    validateOnInput: { description: 'Validates as the user types (vs on blur)' },
    error: { description: 'Custom error message to display' },
    helperText: { description: 'Help text shown below the input' },
    disabled: { description: 'Prevents interaction' },
    readonly: { description: 'Allows copying but not editing' },
    required: { description: 'Marks the field as required' },
  },

  parameters: {
    docs: {
      description: {
        component: `
Email input component with built-in RFC 5322 validation.

**Key Features:**
- RFC 5322 regex email format validation
- Real-time validation feedback on input
- Valid/invalid visual indicators
- Size presets (xs, sm, md, lg)
- Helper text and error message display
- Disabled and readonly states
- ControlValueAccessor integration for reactive forms
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<EmailInputComponent>;

export const Default: Story = {
  args: { label: 'Email Address', placeholder: 'you@example.com', size: 'md' },
};

export const WithHelperText: Story = {
  name: 'With Helper Text',
  args: { label: 'Email', placeholder: 'you@example.com', size: 'md', helperText: 'We\'ll never share your email with third parties.' },
};

export const WithValidation: Story = {
  name: 'Live Validation',
  args: { label: 'Email', placeholder: 'you@example.com', size: 'md', validateOnInput: true, helperText: 'Validation runs as you type' },
};

export const WithError: Story = {
  name: 'Error State',
  args: { label: 'Email', placeholder: 'you@example.com', size: 'md', error: 'Please enter a valid email address' },
};

export const Required: Story = {
  args: { label: 'Work Email', placeholder: 'name@company.com', size: 'md', required: true },
};

export const Disabled: Story = {
  args: { label: 'Email', placeholder: 'you@example.com', size: 'md', disabled: true },
};

export const Readonly: Story = {
  args: { label: 'Account Email', size: 'md', readonly: true },
};

export const Sizes: Story = {
  name: 'Size Comparison',
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 360px;">
        <lc-email-input label="XS" placeholder="xs size" size="xs"></lc-email-input>
        <lc-email-input label="SM" placeholder="sm size" size="sm"></lc-email-input>
        <lc-email-input label="MD (default)" placeholder="md size" size="md"></lc-email-input>
        <lc-email-input label="LG" placeholder="lg size" size="lg"></lc-email-input>
      </div>`,
  }),
};

export const InviteForm: Story = {
  name: 'Team Invite (Composition)',
  render: () => ({
    template: `
      <div style="max-width: 400px;">
        <h4 style="margin: 0 0 4px; font-weight: 600;">Invite Team Members</h4>
        <p style="margin: 0 0 16px; font-size: 13px; color: #666;">Send invitations to join your workspace.</p>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <lc-email-input label="Email 1" placeholder="colleague@company.com" [required]="true" [validateOnInput]="true"></lc-email-input>
          <lc-email-input label="Email 2" placeholder="colleague@company.com" [validateOnInput]="true"></lc-email-input>
          <lc-email-input label="Email 3" placeholder="colleague@company.com" [validateOnInput]="true"></lc-email-input>
        </div>
        <div style="margin-top: 16px;">
          <lc-button variant="primary">Send Invitations</lc-button>
        </div>
      </div>`,
  }),
};

import type { Meta, StoryObj } from '@storybook/angular';
import { AccordionComponent } from './accordion.component';

/**
 * Accordions expand and collapse sections of content, helping users focus on
 * relevant information without overwhelming the page. Perfect for FAQs,
 * settings panels, and long-form content.
 */
const meta: Meta<AccordionComponent> = {
  title: 'Components/Accordion',
  component: AccordionComponent,
  argTypes: {
    title: { description: 'Header text displayed in the toggle button' },
    variant: {
      control: 'select',
      options: ['outlined', 'flat'],
      description: 'Visual style — outlined adds a border, flat blends with the page',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Controls padding and font size of the header',
    },
    expanded: { description: 'Whether the content section is visible (supports two-way binding)' },
    disabled: { description: 'Prevents the accordion from being toggled' },
  },

  parameters: {
    docs: {
      description: {
        component: `
Accordion component for collapsible content sections.

**Key Features:**
- Expandable/collapsible content panels
- Two-way binding for expanded state
- Animated expand/collapse transitions
- Content projection for custom body content
- Accessible with keyboard support
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<AccordionComponent>;

export const Default: Story = {
  args: { title: 'What is Life-Cockpit?', variant: 'outlined', size: 'md', disabled: false, expanded: true },
  render: (args) => ({
    props: args,
    template: `<lc-accordion [title]="title" [variant]="variant" [size]="size" [disabled]="disabled" [expanded]="expanded">
      <p style="margin: 0; color: var(--lc-color-neutral-600);">Life-Cockpit is a personal productivity platform that helps you manage tasks, track habits, and organize your life in one unified dashboard.</p>
    </lc-accordion>`,
  }),
};

export const Expanded: Story = {
  args: { title: 'Getting Started', variant: 'outlined', size: 'md', expanded: true },
  render: (args) => ({
    props: args,
    template: `<lc-accordion [title]="title" [variant]="variant" [size]="size" [expanded]="expanded">
      <div style="color: var(--lc-color-neutral-600);">
        <p style="margin: 0 0 8px;">Follow these steps to get up and running:</p>
        <ol style="margin: 0; padding-left: 20px;">
          <li>Create your account</li>
          <li>Set up your first project</li>
          <li>Invite team members</li>
          <li>Start tracking tasks</li>
        </ol>
      </div>
    </lc-accordion>`,
  }),
};

export const FlatVariant: Story = {
  name: 'Flat Variant',
  args: { title: 'Advanced Settings', variant: 'flat', size: 'md', expanded: true },
  render: (args) => ({
    props: args,
    template: `<lc-accordion [title]="title" [variant]="variant" [size]="size" [expanded]="expanded">
      <p style="margin: 0; color: var(--lc-color-neutral-600);">Flat accordions have no border and blend seamlessly into the surrounding content. Ideal for settings pages and nested layouts.</p>
    </lc-accordion>`,
  }),
};

export const Disabled: Story = {
  args: { title: 'Locked Section (Upgrade Required)', variant: 'outlined', size: 'md', disabled: true },
  render: (args) => ({
    props: args,
    template: `<lc-accordion [title]="title" [variant]="variant" [size]="size" [disabled]="disabled">
      <p style="margin: 0;">This content is not accessible.</p>
    </lc-accordion>`,
  }),
};

export const Sizes: Story = {
  name: 'Size Comparison',
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <lc-accordion title="Small Accordion" size="sm" [expanded]="true">
          <p style="margin: 0; color: var(--lc-color-neutral-600);">Compact size for dense UIs like sidebars and mobile views.</p>
        </lc-accordion>
        <lc-accordion title="Medium Accordion (Default)" size="md" [expanded]="true">
          <p style="margin: 0; color: var(--lc-color-neutral-600);">Standard size suitable for most content sections.</p>
        </lc-accordion>
        <lc-accordion title="Large Accordion" size="lg" [expanded]="true">
          <p style="margin: 0; color: var(--lc-color-neutral-600);">Larger touch targets and more breathing room for prominent sections.</p>
        </lc-accordion>
      </div>`,
  }),
};

export const FAQPage: Story = {
  name: 'FAQ Page (Composition)',
  render: () => ({
    template: `
      <div style="max-width: 640px;">
        <h3 style="margin: 0 0 16px; font-size: 18px; font-weight: 600;">Frequently Asked Questions</h3>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <lc-accordion title="How do I reset my password?" variant="outlined">
            <p style="margin: 0; color: var(--lc-color-neutral-600);">Go to Settings → Security → Change Password. You'll receive a confirmation email with a reset link valid for 24 hours.</p>
          </lc-accordion>
          <lc-accordion title="Can I export my data?" variant="outlined">
            <p style="margin: 0; color: var(--lc-color-neutral-600);">Yes! Navigate to Settings → Data → Export. You can export as CSV, JSON, or PDF. Exports are processed in the background and you'll be notified when ready.</p>
          </lc-accordion>
          <lc-accordion title="What payment methods do you accept?" variant="outlined">
            <p style="margin: 0; color: var(--lc-color-neutral-600);">We accept Visa, Mastercard, American Express, and PayPal. Annual plans also support bank transfer. All payments are processed securely through Stripe.</p>
          </lc-accordion>
          <lc-accordion title="Is there a free plan?" variant="outlined">
            <p style="margin: 0; color: var(--lc-color-neutral-600);">Yes — the Starter plan is free forever and includes up to 3 projects, 10 tasks per project, and basic reporting. Upgrade anytime for unlimited access.</p>
          </lc-accordion>
        </div>
      </div>`,
  }),
};

export const SettingsPanel: Story = {
  name: 'Settings Panel (Composition)',
  render: () => ({
    template: `
      <div style="max-width: 480px;">
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <lc-accordion title="Notifications" variant="flat" [expanded]="true">
            <div style="display: flex; flex-direction: column; gap: 12px; padding: 4px 0;">
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <input type="checkbox" checked /> Email notifications
              </label>
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <input type="checkbox" checked /> Push notifications
              </label>
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <input type="checkbox" /> Weekly digest
              </label>
            </div>
          </lc-accordion>
          <lc-accordion title="Privacy" variant="flat">
            <div style="display: flex; flex-direction: column; gap: 12px; padding: 4px 0;">
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <input type="checkbox" checked /> Show profile publicly
              </label>
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <input type="checkbox" /> Allow search engines to index
              </label>
            </div>
          </lc-accordion>
          <lc-accordion title="Danger Zone" variant="flat">
            <p style="margin: 0; color: var(--lc-color-neutral-600);">Deleting your account is permanent and cannot be undone. All data will be lost.</p>
          </lc-accordion>
        </div>
      </div>`,
  }),
};

import type { Meta, StoryObj } from '@storybook/angular';
import { LogoComponent } from './logo.component';

/**
 * The Life-Cockpit logo component renders the full wordmark or emblem-only variant.
 * Available in multiple sizes. Use `clickable` to make it a link (e.g. back to home).
 */
const meta: Meta<LogoComponent> = {
  title: 'Components/Logo',
  component: LogoComponent,
  argTypes: {
    variant: {
      control: 'select',
      options: ['full', 'emblem'],
      description: 'Full wordmark or emblem/icon only',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Logo dimensions',
    },
    alt: { description: 'Alt text for accessibility' },
    clickable: { description: 'Adds hover effect and cursor pointer (for use as a link)' },
  },

  parameters: {
    docs: {
      description: {
        component: `
Logo component for displaying the Life-Cockpit brand identity.

**Key Features:**
- Full logo and emblem-only variants
- Multiple size options (sm, md, lg)
- SVG-based for crisp rendering at any resolution
- Dark mode compatible
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<LogoComponent>;

export const Full: Story = {
  name: 'Full Wordmark',
  args: { variant: 'full', size: 'md' },
};

export const Emblem: Story = {
  name: 'Emblem Only',
  args: { variant: 'emblem', size: 'md' },
};

export const Clickable: Story = {
  args: { variant: 'full', size: 'md', clickable: true },
};

export const Sizes: Story = {
  name: 'Size Comparison',
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <span style="font-size: 11px; color: #666; width: 24px;">xs</span>
          <lc-logo variant="full" size="xs"></lc-logo>
        </div>
        <div style="display: flex; align-items: center; gap: 16px;">
          <span style="font-size: 11px; color: #666; width: 24px;">sm</span>
          <lc-logo variant="full" size="sm"></lc-logo>
        </div>
        <div style="display: flex; align-items: center; gap: 16px;">
          <span style="font-size: 11px; color: #666; width: 24px;">md</span>
          <lc-logo variant="full" size="md"></lc-logo>
        </div>
        <div style="display: flex; align-items: center; gap: 16px;">
          <span style="font-size: 11px; color: #666; width: 24px;">lg</span>
          <lc-logo variant="full" size="lg"></lc-logo>
        </div>
        <div style="display: flex; align-items: center; gap: 16px;">
          <span style="font-size: 11px; color: #666; width: 24px;">xl</span>
          <lc-logo variant="full" size="xl"></lc-logo>
        </div>
      </div>`,
  }),
};

export const EmblemSizes: Story = {
  name: 'Emblem Sizes',
  render: () => ({
    template: `
      <div style="display: flex; align-items: center; gap: 20px;">
        <lc-logo variant="emblem" size="xs"></lc-logo>
        <lc-logo variant="emblem" size="sm"></lc-logo>
        <lc-logo variant="emblem" size="md"></lc-logo>
        <lc-logo variant="emblem" size="lg"></lc-logo>
        <lc-logo variant="emblem" size="xl"></lc-logo>
      </div>`,
  }),
};

export const InHeader: Story = {
  name: 'In Header (Composition)',
  render: () => ({
    template: `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 24px; border-bottom: 1px solid #eee;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <lc-logo variant="full" size="sm" [clickable]="true"></lc-logo>
          <span style="color: #ddd;">|</span>
          <span style="font-size: 13px; color: #666;">Design System</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 13px;">Sarah Connor</span>
        </div>
      </div>`,
  }),
};

import type { Meta, StoryObj } from '@storybook/angular';
import { FooterComponent } from './footer.component';

const meta: Meta<FooterComponent> = {
  title: 'Layout/Footer',
  component: FooterComponent,
  argTypes: {
    showBorder: { control: 'boolean' },
    compact: { control: 'boolean' },
    variant: { control: 'select', options: ['default', 'primary', 'dark', 'neutral'] },
  },

  parameters: {
    docs: {
      description: {
        component: `
Footer component for application-wide bottom navigation.

**Key Features:**
- Multi-section navigation with link groups
- Copyright text display
- Compact single-row layout option
- Color variants (light, dark)
- Optional top border
- Social media icon links
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<FooterComponent>;

const sampleSections = [
  {
    title: 'Produkt',
    links: [
      { label: 'Features', href: '/features' },
      { label: 'Preise', href: '/pricing' },
      { label: 'Changelog', href: '/changelog' },
    ],
  },
  {
    title: 'Unternehmen',
    links: [
      { label: 'Über uns', href: '/about' },
      { label: 'Karriere', href: '/careers' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'Ressourcen',
    links: [
      { label: 'Dokumentation', href: '/docs' },
      { label: 'API Referenz', href: '/api', external: true },
      { label: 'GitHub', href: 'https://github.com', external: true },
    ],
  },
  {
    title: 'Rechtliches',
    links: [
      { label: 'Datenschutz', href: '/privacy' },
      { label: 'Impressum', href: '/imprint' },
      { label: 'AGB', href: '/terms' },
    ],
  },
];

export const Default: Story = {
  args: {
    showBorder: true,
    compact: false,
    variant: 'default',
  },
  render: (args) => ({
    props: {
      ...args,
      sections: sampleSections,
      copyright: '© 2026 Life-Cockpit. Alle Rechte vorbehalten.',
    },
    template: `<lc-footer [sections]="sections" [copyright]="copyright" [showBorder]="showBorder" [compact]="compact" [variant]="variant" />`,
  }),
};

export const Compact: Story = {
  args: {
    compact: true,
    variant: 'default',
  },
  render: (args) => ({
    props: {
      ...args,
      copyright: '© 2026 Life-Cockpit. Alle Rechte vorbehalten.',
    },
    template: `<lc-footer [copyright]="copyright" [compact]="compact" [variant]="variant" />`,
  }),
};

export const NoBorder: Story = {
  args: {
    showBorder: false,
    variant: 'default',
  },
  render: (args) => ({
    props: {
      ...args,
      sections: sampleSections.slice(0, 2),
      copyright: '© 2026 Life-Cockpit',
    },
    template: `<lc-footer [sections]="sections" [copyright]="copyright" [showBorder]="showBorder" [variant]="variant" />`,
  }),
};

export const CopyrightOnly: Story = {
  args: {
    compact: true,
    variant: 'default',
  },
  render: (args) => ({
    props: {
      ...args,
      copyright: '© 2026 Life-Cockpit GmbH',
    },
    template: `<lc-footer [copyright]="copyright" [compact]="compact" [variant]="variant" />`,
  }),
};

export const Primary: Story = {
  args: {
    variant: 'primary',
  },
  render: (args) => ({
    props: {
      ...args,
      sections: sampleSections,
      copyright: '© 2026 Life-Cockpit. Alle Rechte vorbehalten.',
    },
    template: `<lc-footer [sections]="sections" [copyright]="copyright" [variant]="variant" />`,
  }),
};

export const Dark: Story = {
  args: {
    variant: 'dark',
  },
  render: (args) => ({
    props: {
      ...args,
      sections: sampleSections,
      copyright: '© 2026 Life-Cockpit. Alle Rechte vorbehalten.',
    },
    template: `<lc-footer [sections]="sections" [copyright]="copyright" [variant]="variant" />`,
  }),
};

export const Neutral: Story = {
  args: {
    variant: 'neutral',
  },
  render: (args) => ({
    props: {
      ...args,
      sections: sampleSections.slice(0, 3),
      copyright: '© 2026 Life-Cockpit',
    },
    template: `<lc-footer [sections]="sections" [copyright]="copyright" [variant]="variant" />`,
  }),
};

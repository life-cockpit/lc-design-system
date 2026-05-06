import type { Meta, StoryObj } from '@storybook/angular';
import { HeroComponent } from './hero.component';

const meta: Meta<HeroComponent> = {
  title: 'Layout/Hero',
  component: HeroComponent,
  parameters: {
    docs: {
      description: {
        component: `
The Hero component creates a prominent page header with a gradient background.
Use it at the top of pages to introduce content, highlight key information, or set visual context.

**Key Features:**
- 9 gradient color themes (primary, secondary, neutral, success, info, warning, accent-orange, accent-purple, accent-violet)
- 3 size variants (sm, md, lg) with mobile-first responsive padding and typography
- Content projection for body text and a footer slot for metadata / stats
- Configurable border radius
        `,
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Main headline text',
    },
    label: {
      control: 'text',
      description: 'Small uppercase label above the title',
    },
    color: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'neutral',
        'success',
        'info',
        'warning',
        'accent-orange',
        'accent-purple',
        'accent-violet',
      ],
      description: 'Gradient color theme',
      table: { defaultValue: { summary: 'primary' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Controls padding and font sizes',
      table: { defaultValue: { summary: 'md' } },
    },
    borderRadius: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Corner rounding',
      table: { defaultValue: { summary: 'lg' } },
    },
  },
};

export default meta;
type Story = StoryObj<HeroComponent>;

const footerStatStyle =
  'display: flex; flex-direction: column; gap: 4px;';
const statLabelStyle =
  'font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; opacity: 0.6;';
const statValueStyle = 'font-size: 14px; font-weight: 500;';

export const Default: Story = {
  args: {
    label: 'LIFE-COCKPIT FACTORY',
    title: 'Software wird spec-driven gebaut. Nicht prompt-driven.',
    color: 'primary',
    size: 'md',
    borderRadius: 'lg',
  },
  render: (args) => ({
    props: args,
    template: `
      <lc-hero [label]="label" [title]="title" [color]="color" [size]="size" [borderRadius]="borderRadius">
        <p style="margin: 0;">
          Eine industrialisierte Plattform für AI-getriebene Softwareentwicklung.
          Aus einer Spezifikation entstehen vollständige Features — UI, Backend, Tests, Doku —
          durch orchestrierte KI-Agenten mit menschlicher Kontrolle an jedem kritischen Punkt.
        </p>
        <div hero-footer>
          <div style="${footerStatStyle}">
            <span style="${statLabelStyle}">STAND</span>
            <span style="${statValueStyle}">Mai 2026 · Production-Ready Core</span>
          </div>
          <div style="${footerStatStyle}">
            <span style="${statLabelStyle}">STACK</span>
            <span style="${statValueStyle}">Python 3.13 · FastAPI · PostgreSQL · Bedrock</span>
          </div>
          <div style="${footerStatStyle}">
            <span style="${statLabelStyle}">TESTABDECKUNG</span>
            <span style="${statValueStyle}">1.384 Tests grün</span>
          </div>
          <div style="${footerStatStyle}">
            <span style="${statLabelStyle}">MULTI-TENANCY</span>
            <span style="${statValueStyle}">RLS-isoliert · audit-ready</span>
          </div>
        </div>
      </lc-hero>`,
  }),
};

export const Minimal: Story = {
  args: {
    title: 'Willkommen',
    color: 'neutral',
    size: 'sm',
    borderRadius: 'lg',
  },
  render: (args) => ({
    props: args,
    template: `
      <lc-hero [title]="title" [color]="color" [size]="size" [borderRadius]="borderRadius">
        <p style="margin: 0;">Ein einfacher Hero ohne Label und Footer.</p>
      </lc-hero>`,
  }),
};

export const WithLabel: Story = {
  args: {
    label: 'DASHBOARD',
    title: 'Projektübersicht',
    color: 'secondary',
    size: 'md',
    borderRadius: 'lg',
  },
  render: (args) => ({
    props: args,
    template: `
      <lc-hero [label]="label" [title]="title" [color]="color" [size]="size" [borderRadius]="borderRadius">
        <p style="margin: 0;">Alle wichtigen Metriken und Fortschritte auf einen Blick.</p>
      </lc-hero>`,
  }),
};

export const Large: Story = {
  args: {
    label: 'RELEASE',
    title: 'Version 3.0 ist da.',
    color: 'accent-violet',
    size: 'lg',
    borderRadius: 'lg',
  },
  render: (args) => ({
    props: args,
    template: `
      <lc-hero [label]="label" [title]="title" [color]="color" [size]="size" [borderRadius]="borderRadius">
        <p style="margin: 0;">
          Highlights: Multi-Tenancy, neues Dashboard, verbesserte Performance und über 50 Bugfixes.
        </p>
        <div hero-footer>
          <div style="${footerStatStyle}">
            <span style="${statLabelStyle}">DATUM</span>
            <span style="${statValueStyle}">6. Mai 2026</span>
          </div>
          <div style="${footerStatStyle}">
            <span style="${statLabelStyle}">NEUE FEATURES</span>
            <span style="${statValueStyle}">12</span>
          </div>
          <div style="${footerStatStyle}">
            <span style="${statLabelStyle}">BREAKING CHANGES</span>
            <span style="${statValueStyle}">0</span>
          </div>
        </div>
      </lc-hero>`,
  }),
};

export const NoRadius: Story = {
  args: {
    title: 'Full-Width Hero',
    color: 'info',
    size: 'md',
    borderRadius: 'none',
  },
  render: (args) => ({
    props: args,
    template: `
      <lc-hero [title]="title" [color]="color" [size]="size" [borderRadius]="borderRadius">
        <p style="margin: 0;">Ohne Radius eignet sich der Hero für Edge-to-Edge Layouts.</p>
      </lc-hero>`,
  }),
};

export const AllColors: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <lc-hero title="Primary" color="primary" size="sm" borderRadius="md">
          <p style="margin: 0;">Gradient preview</p>
        </lc-hero>
        <lc-hero title="Secondary" color="secondary" size="sm" borderRadius="md">
          <p style="margin: 0;">Gradient preview</p>
        </lc-hero>
        <lc-hero title="Neutral" color="neutral" size="sm" borderRadius="md">
          <p style="margin: 0;">Gradient preview</p>
        </lc-hero>
        <lc-hero title="Success" color="success" size="sm" borderRadius="md">
          <p style="margin: 0;">Gradient preview</p>
        </lc-hero>
        <lc-hero title="Info" color="info" size="sm" borderRadius="md">
          <p style="margin: 0;">Gradient preview</p>
        </lc-hero>
        <lc-hero title="Warning" color="warning" size="sm" borderRadius="md">
          <p style="margin: 0;">Gradient preview</p>
        </lc-hero>
        <lc-hero title="Accent Orange" color="accent-orange" size="sm" borderRadius="md">
          <p style="margin: 0;">Gradient preview</p>
        </lc-hero>
        <lc-hero title="Accent Purple" color="accent-purple" size="sm" borderRadius="md">
          <p style="margin: 0;">Gradient preview</p>
        </lc-hero>
        <lc-hero title="Accent Violet" color="accent-violet" size="sm" borderRadius="md">
          <p style="margin: 0;">Gradient preview</p>
        </lc-hero>
      </div>`,
  }),
};

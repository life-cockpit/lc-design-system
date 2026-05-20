import type { Meta, StoryObj } from '@storybook/angular';

/**
 * Density showcase — renders the same set of density-aware components side-by-side
 * in all three density modes so the cascade is visually verifiable end-to-end.
 *
 * All component selectors used here (`lc-card`, `lc-list`, `lc-input`, `lc-tabs`,
 * `lc-toolbar`, `lc-button`, `lc-breadcrumbs`, `lc-alert`, `lc-pagination`,
 * `lc-menu`) are globally registered in `.storybook/preview.ts`.
 *
 * No component takes a `density` input here — the visual difference comes purely
 * from the ancestor `[data-density="…"]` attribute setting CSS custom properties
 * (`--lc-density-gap-*`, `--lc-density-padding-*`) on the cascade.
 */
const meta: Meta = {
  title: 'Design Tokens/Density',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The design system exposes three density modes via a single \`data-density\` attribute
on any ancestor element. The attribute sets a small set of CSS custom properties
(\`--lc-density-gap-*\`, \`--lc-density-padding-*\`) that **24+ components** read from
the cascade — wrapping any section in a density attribute rescales every component
inside without template changes.

| Token | compact | cosy *(default)* | comfortable |
|---|---|---|---|
| \`--lc-density-gap-xs\` | 2px | 4px | 8px |
| \`--lc-density-gap-sm\` | 4px | 8px | 12px |
| \`--lc-density-gap-md\` | 8px | 16px | 24px |
| \`--lc-density-gap-lg\` | 12px | 24px | 32px |
| \`--lc-density-gap-xl\` | 16px | 32px | 48px |
| \`--lc-density-padding-xs\` | 4px | 8px | 12px |
| \`--lc-density-padding-sm\` | 8px | 12px | 20px |
| \`--lc-density-padding-md\` | 12px | 16px | 24px |
| \`--lc-density-padding-lg\` | 16px | 24px | 32px |
| \`--lc-density-padding-xl\` | 24px | 32px | 48px |

For the semantic mapping (when to use which token) and the full migration rules,
see **Design Tokens / Spacing → Density Tokens**.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// ─────────────────────────────────────────────────────────────────────────────
// Shared sub-templates used inside each density panel
// ─────────────────────────────────────────────────────────────────────────────

const panelContent = /* HTML */ `
  <lc-breadcrumbs
    [items]="[
      { label: 'Home', href: '#' },
      { label: 'Settings', href: '#' },
      { label: 'Profile' }
    ]"
  ></lc-breadcrumbs>

  <lc-card variant="outlined" style="margin-top: 1rem; display:block">
    <h3 style="margin:0 0 .25rem;font:600 0.95rem/1.3 system-ui">Account details</h3>
    <p style="margin:0 0 1rem;color:var(--color-text-secondary, #6b7280);font:400 0.85rem/1.4 system-ui">
      Layout rhythm cascades from the wrapper's <code>data-density</code>.
    </p>

    <lc-input label="Full name" placeholder="Jane Doe"></lc-input>
    <lc-input label="Email" placeholder="jane@example.com" style="margin-top:.75rem;display:block"></lc-input>

    <div style="margin-top:1rem;display:flex;gap:.5rem;justify-content:flex-end">
      <lc-button variant="secondary" size="sm">Cancel</lc-button>
      <lc-button variant="primary" size="sm">Save</lc-button>
    </div>
  </lc-card>

  <lc-alert variant="info" style="display:block;margin-top:1rem">
    Inline alerts inherit the same padding scale.
  </lc-alert>

  <lc-list
    style="display:block;margin-top:1rem"
    [items]="[
      { label: 'List item one', subtitle: 'gap + padding cascade' },
      { label: 'List item two', subtitle: 'identical markup, different rhythm' },
      { label: 'List item three', subtitle: 'driven by ancestor data-density' }
    ]"
    [showDividers]="true"
  ></lc-list>

  <lc-pagination
    style="display:block;margin-top:1rem"
    [currentPage]="2"
    [totalItems]="80"
    [pageSize]="10"
  ></lc-pagination>
`;

const panelStyle = (accent: string) => /* CSS */ `
  flex: 1 1 0;
  min-width: 0;
  padding: 1.25rem;
  border: 1px solid ${accent};
  border-radius: .75rem;
  background: var(--color-background, #fff);
  position: relative;
  overflow: hidden;
`;

const panelLabel = (label: string, accent: string, note: string) => /* HTML */ `
  <div style="
    display:flex;align-items:baseline;justify-content:space-between;gap:.5rem;
    margin: -1.25rem -1.25rem 1rem;padding:.5rem .75rem;
    background:${accent};color:#fff;
    font:600 0.75rem/1 system-ui;letter-spacing:.05em;text-transform:uppercase;
  ">
    <span>${label}</span>
    <span style="font-weight:400;opacity:.85;text-transform:none;letter-spacing:0">${note}</span>
  </div>
`;

// ─────────────────────────────────────────────────────────────────────────────
// Stories
// ─────────────────────────────────────────────────────────────────────────────

export const SideBySide: Story = {
  name: 'Side-by-side cascade',
  parameters: {
    docs: {
      description: {
        story:
          'The exact same component tree rendered three times. Only the ancestor ' +
          '`data-density` attribute differs — every spacing, padding and gap difference ' +
          'you see is driven by CSS custom properties on the cascade.',
      },
    },
  },
  render: () => ({
    template: /* HTML */ `
      <div style="padding:1.5rem;background:var(--color-surface, #f8fafc);min-height:100vh">
        <div style="
          display:flex;gap:1rem;align-items:stretch;flex-wrap:wrap;
        ">
          <div data-density="compact" style="${panelStyle('#475569')}">
            ${panelLabel('Compact', '#475569', 'data-density="compact"')}
            ${panelContent}
          </div>

          <div data-density="cosy" style="${panelStyle('#0ea5e9')}">
            ${panelLabel('Cosy', '#0ea5e9', 'data-density="cosy" — default')}
            ${panelContent}
          </div>

          <div data-density="comfortable" style="${panelStyle('#10b981')}">
            ${panelLabel('Comfortable', '#10b981', 'data-density="comfortable"')}
            ${panelContent}
          </div>
        </div>
      </div>
    `,
  }),
};

export const Stacked: Story = {
  name: 'Stacked (full-width)',
  parameters: {
    docs: {
      description: {
        story:
          'Same tree, stacked vertically at full width so you can compare exact ' +
          'pixel rhythm without horizontal compression. Useful for screenshot regressions.',
      },
    },
  },
  render: () => ({
    template: /* HTML */ `
      <div style="padding:1.5rem;background:var(--color-surface, #f8fafc)">
        <div data-density="compact" style="${panelStyle('#475569')};margin-bottom:1.25rem">
          ${panelLabel('Compact', '#475569', 'data-density="compact"')}
          ${panelContent}
        </div>

        <div data-density="cosy" style="${panelStyle('#0ea5e9')};margin-bottom:1.25rem">
          ${panelLabel('Cosy', '#0ea5e9', 'data-density="cosy" — default')}
          ${panelContent}
        </div>

        <div data-density="comfortable" style="${panelStyle('#10b981')}">
          ${panelLabel('Comfortable', '#10b981', 'data-density="comfortable"')}
          ${panelContent}
        </div>
      </div>
    `,
  }),
};

export const TokenInspector: Story = {
  name: 'Token values (live)',
  parameters: {
    docs: {
      description: {
        story:
          'Shows the *computed* values of each density token inside each mode. ' +
          'Useful when validating that a component is reading the right rung of the scale.',
      },
    },
  },
  render: () => ({
    template: /* HTML */ `
      <div style="padding:1.5rem;background:var(--color-surface, #f8fafc);font-family:system-ui">
        <div style="display:flex;gap:1rem;flex-wrap:wrap">
          ${(['compact', 'cosy', 'comfortable'] as const)
            .map(
              (mode) => /* HTML */ `
                <div
                  data-density="${mode}"
                  style="flex:1 1 0;min-width:240px;padding:1rem;border:1px solid #cbd5e1;border-radius:.5rem;background:#fff"
                >
                  <h4 style="margin:0 0 .75rem;font:600 0.85rem/1 system-ui;text-transform:uppercase;letter-spacing:.05em">
                    ${mode}
                  </h4>
                  ${[
                    'gap-xs',
                    'gap-sm',
                    'gap-md',
                    'gap-lg',
                    'gap-xl',
                    'padding-xs',
                    'padding-sm',
                    'padding-md',
                    'padding-lg',
                    'padding-xl',
                  ]
                    .map(
                      (key) => /* HTML */ `
                        <div
                          style="display:flex;align-items:center;gap:.5rem;font:400 0.75rem/1.4 ui-monospace,monospace;margin-bottom:.25rem"
                        >
                          <span
                            style="display:inline-block;background:#0ea5e9;height:8px;width:var(--lc-density-${key});flex-shrink:0;border-radius:2px"
                          ></span>
                          <span style="color:#475569;min-width:7.5rem">--lc-density-${key}</span>
                        </div>
                      `,
                    )
                    .join('')}
                </div>
              `,
            )
            .join('')}
        </div>
      </div>
    `,
  }),
};

export const LocalOverride: Story = {
  name: 'Local override beats cascade',
  parameters: {
    docs: {
      description: {
        story:
          'You can set `data-density` on a deeply nested node to override an ' +
          'ancestor. Components inside that node pick up the inner value. This is ' +
          'the standard pattern for one-off "tighter card inside a comfortable page" ' +
          'compositions.',
      },
    },
  },
  render: () => ({
    template: /* HTML */ `
      <div data-density="comfortable" style="padding:1.5rem;background:var(--color-surface, #f8fafc)">
        <p style="margin:0 0 1rem;font:600 0.85rem/1.2 system-ui;color:#10b981;letter-spacing:.05em;text-transform:uppercase">
          Outer wrapper: data-density="comfortable"
        </p>

        <lc-card variant="outlined" style="display:block;margin-bottom:1rem">
          <strong>Outer card</strong> — inherits comfortable rhythm.
          <lc-list
            style="display:block;margin-top:.5rem"
            [items]="[{ label: 'Roomy list item' }, { label: 'Roomy list item' }]"
            [showDividers]="true"
          ></lc-list>
        </lc-card>

        <div data-density="compact" style="border:1px dashed #475569;padding:1rem;border-radius:.5rem">
          <p style="margin:0 0 .75rem;font:600 0.75rem/1.2 system-ui;color:#475569;letter-spacing:.05em;text-transform:uppercase">
            Nested wrapper: data-density="compact" (wins inside this subtree)
          </p>

          <lc-card variant="outlined" style="display:block">
            <strong>Inner card</strong> — now tight regardless of the outer page.
            <lc-list
              style="display:block;margin-top:.5rem"
              [items]="[{ label: 'Tight list item' }, { label: 'Tight list item' }]"
              [showDividers]="true"
            ></lc-list>
          </lc-card>
        </div>
      </div>
    `,
  }),
};

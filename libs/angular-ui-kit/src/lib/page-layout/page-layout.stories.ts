import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { PageLayoutComponent } from './page-layout.component';
import { PageHeaderComponent } from '../page-header/page-header.component';
import { ChatComponent } from '../chat/chat.component';

/**
 * PageLayout is a full-height page shell. It pins a header (and optional footer)
 * while the body fills the remaining height and scrolls **internally** — the
 * page itself never scrolls.
 *
 * It encapsulates the "height chain" such layouts need (`100dvh`, `overflow:
 * hidden`, and `min-height: 0` on the body) so you don't have to rebuild it per
 * app. Children that bring their own internal scroll + sticky footer — like
 * `<lc-chat>` — just need `height: 100%`, which the body provides for free.
 *
 * Slots:
 * - `[layout-header]` — pinned top
 * - default — scrolling body
 * - `[layout-footer]` — pinned bottom
 */
const meta: Meta<PageLayoutComponent> = {
  title: 'Layout/PageLayout',
  component: PageLayoutComponent,
  decorators: [
    moduleMetadata({
      imports: [PageHeaderComponent, ChatComponent],
    }),
  ],
  argTypes: {
    fill: {
      control: 'inline-radio',
      options: ['screen', 'parent'],
      description: 'Height source: 100dvh (screen) or 100% (parent).',
    },
    scrollBody: { description: 'Whether the body scrolls internally.' },
    padded: { description: 'Add density-aware padding to the body.' },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Full-height page shell with a pinned header/footer and an internally scrolling body.

**Key Features:**
- Encapsulates the full-height "height chain" (\`100dvh\` / \`100%\`, \`overflow: hidden\`, \`min-height: 0\`)
- Header/footer pinned, body fills + scrolls — the page never scrolls
- \`fill="screen"\` for the page root, \`fill="parent"\` when nested below an app shell
- Plays nicely with \`<lc-chat>\`, which fills the body and keeps its input pinned
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<PageLayoutComponent>;

/** Long content scrolls under a pinned page header; the page stays put. */
export const ScrollingContent: Story = {
  name: 'Scrolling Content',
  args: { fill: 'screen', scrollBody: true, padded: true },
  render: (args) => ({
    props: { ...args, items: Array.from({ length: 40 }, (_, i) => i + 1) },
    template: `
      <lc-page-layout [fill]="fill" [scrollBody]="scrollBody" [padded]="padded">
        <lc-page-header layout-header title="Reports" subtitle="Stays pinned while the body scrolls" [showDivider]="true" />
        @for (i of items; track i) {
          <p style="margin: 0 0 16px; color: var(--color-text-secondary);">
            Row {{ i }} — scroll this body; the header above and the page itself never move.
          </p>
        }
      </lc-page-layout>`,
  }),
};

/** The headline use case: chat fills the height, input pinned at the bottom. */
export const ChatFullHeight: Story = {
  name: 'Chat (full height)',
  args: { fill: 'screen', scrollBody: true, padded: false },
  render: (args) => ({
    props: {
      ...args,
      messages: [
        { id: '1', role: 'agent', content: 'Hi! The page header stays on top, I fill the rest, and the input stays pinned at the bottom.' },
        { id: '2', role: 'user', content: 'And the page itself never scrolls?' },
        { id: '3', role: 'agent', content: 'Exactly — only my message list scrolls internally.' },
      ],
    },
    template: `
      <lc-page-layout [fill]="fill" [scrollBody]="scrollBody" [padded]="padded">
        <lc-page-header layout-header title="Assistant" subtitle="Pinned page header" [showDivider]="true" />
        <lc-chat [messages]="messages" [showHeader]="false" [bordered]="false" messageAnchor="bottom" />
      </lc-page-layout>`,
  }),
};

/** Header + body + a custom pinned footer bar. */
export const WithFooter: Story = {
  name: 'With Footer',
  args: { fill: 'screen', scrollBody: true, padded: true },
  render: (args) => ({
    props: { ...args, items: Array.from({ length: 30 }, (_, i) => i + 1) },
    template: `
      <lc-page-layout [fill]="fill" [scrollBody]="scrollBody" [padded]="padded">
        <lc-page-header layout-header title="Editor" [showDivider]="true" />
        @for (i of items; track i) {
          <p style="margin: 0 0 16px; color: var(--color-text-secondary);">Line {{ i }}</p>
        }
        <div layout-footer style="display:flex; justify-content:flex-end; gap:8px; padding:12px 16px; border-top:1px solid var(--color-divider); background: var(--color-surface-2);">
          <button style="padding:6px 14px;">Cancel</button>
          <button style="padding:6px 14px;">Save</button>
        </div>
      </lc-page-layout>`,
  }),
};

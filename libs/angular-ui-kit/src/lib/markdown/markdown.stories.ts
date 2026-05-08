import type { Meta, StoryObj } from '@storybook/angular';
import { MarkdownComponent } from './markdown.component';

const meta: Meta<MarkdownComponent> = {
  title: 'Components/Markdown',
  component: MarkdownComponent,
  parameters: {
    docs: {
      description: {
        component: `
The Markdown component renders GitHub-Flavored Markdown (GFM) to sanitized HTML.
Supports headings, bold, italic, links, images, tables, task lists, strikethrough,
blockquotes, and fenced code blocks with syntax highlighting via \`<lc-code-block>\`.
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'compact'],
    },
    linkTarget: {
      control: 'select',
      options: ['_self', '_blank'],
    },
  },
};

export default meta;
type Story = StoryObj<MarkdownComponent>;

const sampleMarkdown = `# Project Overview

This is a **design system** built with *Angular* and ~~jQuery~~ modern tooling.

## Features

- Component library with **75+** components
- Dark mode support
- Accessible by default (WCAG 2.1 AA)

### Code Example

\`\`\`typescript
import { ButtonComponent } from '@life-cockpit/angular-ui-kit';

@Component({
  imports: [ButtonComponent],
  template: \\\`<lc-button variant="primary">Click me</lc-button>\\\`
})
export class MyComponent {}
\`\`\`

## Data Table

| Component | Status | Tests |
|-----------|--------|-------|
| Button    | Stable | 42    |
| Modal     | Stable | 18    |
| Combobox  | New    | 12    |

## Task List

- [x] Implement core components
- [x] Add dark mode
- [ ] Write documentation
- [ ] Publish to npm

> **Note:** This is a blockquote with \`inline code\` inside.

For more info, visit [the docs](https://design.life-cockpit.de).
`;

export const Default: Story = {
  args: { content: sampleMarkdown, variant: 'default', syntaxHighlight: true },
};

export const Compact: Story = {
  args: { content: sampleMarkdown, variant: 'compact', syntaxHighlight: true },
  parameters: {
    docs: { description: { story: 'Compact variant with tighter spacing for inline previews.' } },
  },
};

export const WithHeadingAnchors: Story = {
  args: { content: sampleMarkdown, showHeadingAnchors: true },
  parameters: {
    docs: { description: { story: 'Heading anchor links appear on hover for TOC navigation.' } },
  },
};

export const SimpleText: Story = {
  args: {
    content: `A short paragraph with **bold**, *italic*, and \`code\`. Also ~~strikethrough~~.\n\nSecond paragraph with a [link](https://example.com).`,
  },
  parameters: {
    docs: { description: { story: 'Minimal inline formatting.' } },
  },
};

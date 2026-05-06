import type { Meta, StoryObj } from '@storybook/angular';
import { DiffViewerComponent } from './diff-viewer.component';

const meta: Meta<DiffViewerComponent> = {
  title: 'Components/Diff Viewer',
  component: DiffViewerComponent,
  tags: ['autodocs'],
  argTypes: {
    mode: { control: 'radio', options: ['side-by-side', 'inline'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Diff viewer for comparing two texts side-by-side or inline. ' +
          'Shows added, removed, and unchanged lines with line numbers, ' +
          'change statistics, and configurable context lines.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<DiffViewerComponent>;

const oldCode = `function greet(name) {
  console.log("Hello, " + name);
  return true;
}

function add(a, b) {
  return a + b;
}`;

const newCode = `function greet(name: string) {
  console.log(\`Hello, \${name}!\`);
  return true;
}

function add(a: number, b: number): number {
  return a + b;
}

function subtract(a: number, b: number): number {
  return a - b;
}`;

export const SideBySide: Story = {
  args: {
    oldText: oldCode,
    newText: newCode,
    oldLabel: 'Before',
    newLabel: 'After',
    mode: 'side-by-side',
  },
};

export const Inline: Story = {
  args: {
    oldText: oldCode,
    newText: newCode,
    oldLabel: 'v1.0',
    newLabel: 'v2.0',
    mode: 'inline',
  },
};

export const NoLineNumbers: Story = {
  args: {
    oldText: 'First line\nSecond line\nThird line',
    newText: 'First line\nModified second\nThird line\nFourth line',
    showLineNumbers: false,
    mode: 'inline',
  },
};

export const ContextLines: Story = {
  args: {
    oldText: Array.from({ length: 20 }, (_, i) => `Line ${i + 1}: unchanged content`).join('\n'),
    newText: Array.from({ length: 20 }, (_, i) =>
      i === 9 ? 'Line 10: MODIFIED content' : `Line ${i + 1}: unchanged content`
    ).join('\n'),
    contextLines: 2,
    mode: 'inline',
  },
};

export const Identical: Story = {
  args: {
    oldText: 'Same content\non both sides',
    newText: 'Same content\non both sides',
    oldLabel: 'File A',
    newLabel: 'File B',
  },
};

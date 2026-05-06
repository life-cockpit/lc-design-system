import type { Meta, StoryObj } from '@storybook/angular';
import { CodeBlockComponent } from './code-block.component';

const meta: Meta<CodeBlockComponent> = {
  title: 'Data Display/Code Block',
  component: CodeBlockComponent,
  argTypes: {
    language: {
      control: 'select',
      options: ['typescript', 'javascript', 'html', 'css', 'scss', 'json', 'bash', 'text'],
    },
    showLineNumbers: { control: 'boolean' },
    showCopy: { control: 'boolean' },
    showHeader: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<CodeBlockComponent>;

export const TypeScript: Story = {
  args: {
    code: `import { Component, input } from '@angular/core';

@Component({
  selector: 'lc-example',
  standalone: true,
  template: \`<p>{{ message() }}</p>\`,
})
export class ExampleComponent {
  message = input.required<string>();
}`,
    language: 'typescript',
    filename: 'example.component.ts',
    showLineNumbers: true,
    showCopy: true,
    showHeader: true,
  },
};

export const JSON: Story = {
  args: {
    code: `{
  "name": "@life-cockpit/angular-ui-kit",
  "version": "1.0.0",
  "dependencies": {
    "@angular/core": "^19.0.0"
  }
}`,
    language: 'json',
    filename: 'package.json',
  },
};

export const Bash: Story = {
  args: {
    code: `npm install @life-cockpit/angular-ui-kit
npx nx build angular-ui-kit
npx nx test angular-ui-kit`,
    language: 'bash',
    showLineNumbers: false,
  },
};

export const NoHeader: Story = {
  args: {
    code: `const sum = (a: number, b: number) => a + b;`,
    language: 'typescript',
    showHeader: false,
  },
};

export const HTML: Story = {
  args: {
    code: `<lc-button variant="primary" size="md">
  Click me
</lc-button>

<lc-card>
  <h3>Title</h3>
  <p>Content goes here</p>
</lc-card>`,
    language: 'html',
  },
};

import type { Meta, StoryObj } from '@storybook/angular';
import { StackComponent } from './stack.component';

/**
 * Stack is a layout utility that arranges children in a row or column with
 * consistent spacing. It simplifies flexbox patterns by providing props for
 * direction, gap, alignment, justification, and wrapping.
 */
const meta: Meta<StackComponent> = {
  title: 'Layout/Stack',
  component: StackComponent,
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      description: 'Layout direction (column or row)',
    },
    gap: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Spacing between items',
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch', 'baseline'],
      description: 'Cross-axis alignment (align-items)',
    },
    justify: {
      control: 'select',
      options: ['start', 'center', 'end', 'between', 'around', 'evenly'],
      description: 'Main-axis distribution (justify-content)',
    },
    wrap: { description: 'Whether items wrap to the next line' },
    fullWidth: { description: 'Whether the stack takes full width of its parent' },
  },
};

export default meta;
type Story = StoryObj<StackComponent>;

const childStyle = 'padding: 12px 16px; background: #e5e7eb; border-radius: 6px; font-size: 13px;';

export const Vertical: Story = {
  name: 'Vertical (Default)',
  args: { direction: 'vertical', gap: 'md' },
  render: (args) => ({
    props: args,
    template: `<lc-stack [direction]="direction" [gap]="gap">
      <div style="${childStyle}">First item</div>
      <div style="${childStyle}">Second item</div>
      <div style="${childStyle}">Third item</div>
    </lc-stack>`,
  }),
};

export const Horizontal: Story = {
  args: { direction: 'horizontal', gap: 'md' },
  render: (args) => ({
    props: args,
    template: `<lc-stack [direction]="direction" [gap]="gap">
      <div style="${childStyle}">One</div>
      <div style="${childStyle}">Two</div>
      <div style="${childStyle}">Three</div>
    </lc-stack>`,
  }),
};

export const SpaceBetween: Story = {
  name: 'Justify: Space Between',
  args: { direction: 'horizontal', gap: 'md', justify: 'between', fullWidth: true },
  render: (args) => ({
    props: args,
    template: `<lc-stack [direction]="direction" [gap]="gap" [justify]="justify" [fullWidth]="fullWidth">
      <div style="${childStyle}">Left</div>
      <div style="${childStyle}">Center</div>
      <div style="${childStyle}">Right</div>
    </lc-stack>`,
  }),
};

export const CenterAligned: Story = {
  name: 'Center Aligned',
  args: { direction: 'horizontal', gap: 'md', align: 'center' },
  render: (args) => ({
    props: args,
    template: `<lc-stack [direction]="direction" [gap]="gap" [align]="align">
      <div style="${childStyle} height: 60px; display: flex; align-items: center;">Tall</div>
      <div style="${childStyle}">Short</div>
      <div style="${childStyle} height: 80px; display: flex; align-items: center;">Taller</div>
    </lc-stack>`,
  }),
};

export const GapSizes: Story = {
  name: 'Gap Comparison',
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <div style="font-size: 11px; color: #666; margin-bottom: 4px;">gap: xs</div>
          <lc-stack direction="horizontal" gap="xs">
            <div style="${childStyle}">A</div><div style="${childStyle}">B</div><div style="${childStyle}">C</div>
          </lc-stack>
        </div>
        <div>
          <div style="font-size: 11px; color: #666; margin-bottom: 4px;">gap: sm</div>
          <lc-stack direction="horizontal" gap="sm">
            <div style="${childStyle}">A</div><div style="${childStyle}">B</div><div style="${childStyle}">C</div>
          </lc-stack>
        </div>
        <div>
          <div style="font-size: 11px; color: #666; margin-bottom: 4px;">gap: md</div>
          <lc-stack direction="horizontal" gap="md">
            <div style="${childStyle}">A</div><div style="${childStyle}">B</div><div style="${childStyle}">C</div>
          </lc-stack>
        </div>
        <div>
          <div style="font-size: 11px; color: #666; margin-bottom: 4px;">gap: lg</div>
          <lc-stack direction="horizontal" gap="lg">
            <div style="${childStyle}">A</div><div style="${childStyle}">B</div><div style="${childStyle}">C</div>
          </lc-stack>
        </div>
        <div>
          <div style="font-size: 11px; color: #666; margin-bottom: 4px;">gap: xl</div>
          <lc-stack direction="horizontal" gap="xl">
            <div style="${childStyle}">A</div><div style="${childStyle}">B</div><div style="${childStyle}">C</div>
          </lc-stack>
        </div>
      </div>`,
  }),
};

export const Wrapping: Story = {
  name: 'With Wrapping',
  args: { direction: 'horizontal', gap: 'sm', wrap: true },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 300px; border: 1px dashed #ccc; padding: 12px; border-radius: 6px;">
        <lc-stack [direction]="direction" [gap]="gap" [wrap]="wrap">
          <div style="${childStyle}">Tag One</div>
          <div style="${childStyle}">Tag Two</div>
          <div style="${childStyle}">Tag Three</div>
          <div style="${childStyle}">Tag Four</div>
          <div style="${childStyle}">Tag Five</div>
          <div style="${childStyle}">Tag Six</div>
        </lc-stack>
      </div>`,
  }),
};

export const FormLayout: Story = {
  name: 'Form Layout (Composition)',
  render: () => ({
    template: `
      <div style="max-width: 400px;">
        <lc-stack direction="vertical" gap="lg">
          <lc-stack direction="vertical" gap="sm">
            <label style="font-size: 14px; font-weight: 500;">Full Name</label>
            <input style="padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px;" placeholder="John Doe" />
          </lc-stack>
          <lc-stack direction="horizontal" gap="md" [fullWidth]="true">
            <lc-stack direction="vertical" gap="sm" style="flex: 1;">
              <label style="font-size: 14px; font-weight: 500;">City</label>
              <input style="padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; width: 100%; box-sizing: border-box;" placeholder="City" />
            </lc-stack>
            <lc-stack direction="vertical" gap="sm" style="width: 100px;">
              <label style="font-size: 14px; font-weight: 500;">ZIP</label>
              <input style="padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; width: 100%; box-sizing: border-box;" placeholder="12345" />
            </lc-stack>
          </lc-stack>
          <lc-stack direction="horizontal" gap="sm" justify="end">
            <button style="padding: 8px 16px; border: 1px solid #ddd; border-radius: 6px; background: white; cursor: pointer;">Cancel</button>
            <button style="padding: 8px 16px; border: none; border-radius: 6px; background: #4f8ef7; color: white; cursor: pointer;">Save</button>
          </lc-stack>
        </lc-stack>
      </div>`,
  }),
};

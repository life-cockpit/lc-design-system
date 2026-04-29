import type { Meta, StoryObj } from '@storybook/angular';
import { TypographyComponent } from './typography.component';

const meta: Meta<TypographyComponent> = {
  title: 'Components/Typography',
  component: TypographyComponent,
  argTypes: {
    variant: { control: 'select', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body1', 'body2', 'subtitle1', 'subtitle2', 'caption', 'overline'] },
    align: { control: 'select', options: ['left', 'center', 'right', 'justify'] },
    color: { control: 'select', options: ['primary', 'secondary', 'disabled', 'error', 'success', 'warning', 'info'] },
    weight: { control: 'select', options: ['regular', 'medium', 'semibold', 'bold'] },
    transform: { control: 'select', options: ['none', 'uppercase', 'lowercase', 'capitalize'] },
  },
};

export default meta;
type Story = StoryObj<TypographyComponent>;

export const Heading1: Story = {
  args: { variant: 'h1' },
  render: (args) => ({
    props: args,
    template: `<lc-typography [variant]="variant">Heading 1</lc-typography>`,
  }),
};

export const Body1: Story = {
  args: { variant: 'body1' },
  render: (args) => ({
    props: args,
    template: `<lc-typography [variant]="variant">This is body text that demonstrates the default paragraph styling of the design system.</lc-typography>`,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <lc-typography variant="h1">Heading 1</lc-typography>
        <lc-typography variant="h2">Heading 2</lc-typography>
        <lc-typography variant="h3">Heading 3</lc-typography>
        <lc-typography variant="h4">Heading 4</lc-typography>
        <lc-typography variant="h5">Heading 5</lc-typography>
        <lc-typography variant="h6">Heading 6</lc-typography>
        <lc-typography variant="subtitle1">Subtitle 1</lc-typography>
        <lc-typography variant="subtitle2">Subtitle 2</lc-typography>
        <lc-typography variant="body1">Body 1</lc-typography>
        <lc-typography variant="body2">Body 2</lc-typography>
        <lc-typography variant="caption">Caption</lc-typography>
        <lc-typography variant="overline">Overline</lc-typography>
      </div>`,
  }),
};

export const LineClamp: Story = {
  args: { variant: 'body1', lineClamp: 2 },
  render: (args) => ({
    props: args,
    template: `<lc-typography [variant]="variant" [lineClamp]="lineClamp" style="max-width: 300px;">
      This is a very long text that should be clamped to only two lines. The rest of the content will be hidden with an ellipsis indicator.
    </lc-typography>`,
  }),
};

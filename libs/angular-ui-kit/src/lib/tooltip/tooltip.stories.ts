import type { Meta, StoryObj } from '@storybook/angular';
import { TooltipDirective } from './tooltip.directive';
import { ButtonComponent } from '../button/button.component';

/**
 * Tooltips display informative text when users hover over or focus on an element.
 * Applied as a directive (`lcTooltip`) on any element. Supports four positions
 * and an optional show delay.
 */
const meta: Meta<TooltipDirective> = {
  title: 'Feedback/Tooltip',
  component: TooltipDirective,
  tags: ['autodocs'],
  argTypes: {
    lcTooltip: { description: 'The text content to display in the tooltip' },
    tooltipPosition: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Which side of the element the tooltip appears on',
    },
    tooltipShowDelay: { description: 'Delay in milliseconds before showing (default: 0)' },
  },
};

export default meta;
type Story = StoryObj<TooltipDirective>;

export const Default: Story = {
  render: () => ({
    template: `<lc-button lcTooltip="Save your current progress">Hover me</lc-button>`,
  }),
};

export const Positions: Story = {
  name: 'All Positions',
  render: () => ({
    template: `
      <div style="display: flex; gap: 24px; padding: 80px 60px;">
        <lc-button lcTooltip="Appears above the element" tooltipPosition="top" variant="outlined">Top</lc-button>
        <lc-button lcTooltip="Appears below the element" tooltipPosition="bottom" variant="outlined">Bottom</lc-button>
        <lc-button lcTooltip="Appears to the left" tooltipPosition="left" variant="outlined">Left</lc-button>
        <lc-button lcTooltip="Appears to the right" tooltipPosition="right" variant="outlined">Right</lc-button>
      </div>`,
  }),
};

export const WithDelay: Story = {
  name: 'With Show Delay',
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; padding: 40px;">
        <lc-button lcTooltip="Instant (0ms)" [tooltipShowDelay]="0" variant="outlined">No delay</lc-button>
        <lc-button lcTooltip="Shows after 300ms" [tooltipShowDelay]="300" variant="outlined">300ms</lc-button>
        <lc-button lcTooltip="Shows after 800ms" [tooltipShowDelay]="800" variant="outlined">800ms</lc-button>
      </div>`,
  }),
};

export const OnIcons: Story = {
  name: 'On Icon Buttons',
  render: () => ({
    template: `
      <div style="display: flex; gap: 12px; padding: 40px;">
        <lc-button lcTooltip="Edit document" tooltipPosition="bottom" variant="outlined" [iconOnly]="true" iconBefore="pencil" size="sm"></lc-button>
        <lc-button lcTooltip="Delete item" tooltipPosition="bottom" variant="outlined" [iconOnly]="true" iconBefore="trash" size="sm"></lc-button>
        <lc-button lcTooltip="Share link" tooltipPosition="bottom" variant="outlined" [iconOnly]="true" iconBefore="share" size="sm"></lc-button>
        <lc-button lcTooltip="Download file" tooltipPosition="bottom" variant="outlined" [iconOnly]="true" iconBefore="arrow-down-tray" size="sm"></lc-button>
      </div>`,
  }),
};

export const LongContent: Story = {
  name: 'Long Content',
  render: () => ({
    template: `
      <div style="padding: 60px;">
        <lc-button lcTooltip="This tooltip has a longer description that explains the action in more detail. It wraps to multiple lines automatically." tooltipPosition="top" variant="outlined">Hover for details</lc-button>
      </div>`,
  }),
};

export const Toolbar: Story = {
  name: 'Toolbar (Composition)',
  render: () => ({
    template: `
      <div style="display: inline-flex; gap: 2px; padding: 40px; background: #f9f9f9; border-radius: 8px;">
        <lc-button lcTooltip="Bold (Ctrl+B)" tooltipPosition="bottom" variant="text" size="sm" [iconOnly]="true" iconBefore="bold"></lc-button>
        <lc-button lcTooltip="Italic (Ctrl+I)" tooltipPosition="bottom" variant="text" size="sm" [iconOnly]="true" iconBefore="italic"></lc-button>
        <lc-button lcTooltip="Underline (Ctrl+U)" tooltipPosition="bottom" variant="text" size="sm" [iconOnly]="true" iconBefore="underline"></lc-button>
        <div style="width: 1px; background: #ddd; margin: 4px 6px;"></div>
        <lc-button lcTooltip="Align left" tooltipPosition="bottom" variant="text" size="sm" [iconOnly]="true" iconBefore="bars-3-bottom-left"></lc-button>
        <lc-button lcTooltip="Align center" tooltipPosition="bottom" variant="text" size="sm" [iconOnly]="true" iconBefore="bars-3"></lc-button>
        <lc-button lcTooltip="Align right" tooltipPosition="bottom" variant="text" size="sm" [iconOnly]="true" iconBefore="bars-3-bottom-right"></lc-button>
      </div>`,
  }),
};

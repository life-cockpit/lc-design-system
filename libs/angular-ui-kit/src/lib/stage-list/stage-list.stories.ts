import type { Meta, StoryObj } from '@storybook/angular';
import { fn } from 'storybook/test';
import { StageItem, StageListComponent } from './stage-list.component';

const baseStages: StageItem[] = [
  { label: 'Planung', value: 3, color: '#2563eb', id: 'planung' },
  { label: 'Spezifikation', value: 0, color: '#0891b2', id: 'spec' },
  { label: 'Implementierung', value: 18, color: '#0d9488', id: 'impl' },
  { label: 'Review', value: 1, color: '#f59e0b', id: 'review' },
  { label: 'Auslieferung', value: 0, color: '#7c3aed', id: 'ship' },
];

const meta: Meta<StageListComponent> = {
  title: 'Data Display/Stage List',
  component: StageListComponent,
  tags: ['autodocs'],
  args: {
    stageClick: fn(),
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'],
      table: { defaultValue: { summary: 'md' } },
    },
    stageClick: {
      action: 'stageClick',
      description: 'Emits the clicked stage item when clickable is true.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
Stage list for small distributions such as pipeline progress and status breakdowns.

Each row contains a color dot, a label, an optional value, and an optional proportional bar.
Long labels wrap instead of clipping.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<StageListComponent>;

export const Default: Story = {
  args: {
    stages: baseStages,
  },
};

export const AllZero: Story = {
  args: {
    stages: [
      { label: 'Planung', value: 0 },
      { label: 'Implementierung', value: 0 },
      { label: 'Review', value: 0 },
      { label: 'Auslieferung', value: 0 },
    ],
  },
};

export const SingleStage: Story = {
  args: {
    stages: [{ label: 'Implementierung', value: 42, color: '#0d9488' }],
  },
};

export const Clickable: Story = {
  args: {
    stages: baseStages,
    clickable: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <lc-stage-list
        [stages]="stages"
        [clickable]="clickable"
        [showValue]="showValue"
        [showBar]="showBar"
        [size]="size"
        [max]="max"
        [emptyText]="emptyText"
        (stageClick)="stageClick($event)"
      />
    `,
  }),
};

export const NoBar: Story = {
  args: {
    stages: baseStages,
    showBar: false,
  },
};

export const Small: Story = {
  args: {
    stages: baseStages,
    size: 'sm',
  },
};

export const LongLabels: Story = {
  args: {
    stages: [
      {
        label: 'Spezifikation und fachliche Abstimmung mit sehr langen Anforderungen ohne Textkappung',
        value: 12,
        color: '#2563eb',
      },
      {
        label: 'Implementierung inklusive Validierung gegen mehrere abhängige Subsysteme',
        value: 6,
        color: '#0d9488',
      },
      {
        label: 'Review mit Governance, Security-Checks und Freigabeprozess durch mehrere Rollen',
        value: 2,
        color: '#f59e0b',
      },
    ],
  },
};

export const SharedMax: Story = {
  render: () => ({
    template: `
      <div style="display: grid; gap: 1.5rem; max-width: 560px;">
        <lc-stage-list
          [stages]="teamA"
          [max]="20"
        />
        <lc-stage-list
          [stages]="teamB"
          [max]="20"
        />
      </div>
    `,
    props: {
      teamA: [
        { label: 'Planung', value: 3, color: '#2563eb' },
        { label: 'Implementierung', value: 12, color: '#0d9488' },
        { label: 'Review', value: 2, color: '#f59e0b' },
      ] satisfies StageItem[],
      teamB: [
        { label: 'Planung', value: 1, color: '#2563eb' },
        { label: 'Implementierung', value: 7, color: '#0d9488' },
        { label: 'Review', value: 6, color: '#f59e0b' },
      ] satisfies StageItem[],
    },
  }),
};

import type { Meta, StoryObj } from '@storybook/angular';
import { TimelineComponent } from './timeline.component';

const meta: Meta<TimelineComponent> = {
  title: 'Data Display/Timeline',
  component: TimelineComponent,
  parameters: {
    docs: {
      description: {
        component: `
Chronological event display for activity feeds, changelogs, and process tracking.

**Key Features:**
- Vertical and horizontal orientations
- Color-coded dots or icons per event
- Optional description and timestamp
- Compact mode for dense layouts
        `,
      },
    },
  },
  argTypes: {
    orientation: { control: 'select', options: ['vertical', 'horizontal'] },
    compact: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<TimelineComponent>;

const sampleItems = [
  { title: 'Projekt erstellt', description: 'Repository initialisiert und CI/CD eingerichtet.', timestamp: '1. Mai 2026', color: 'primary' as const },
  { title: 'Design System v1.0', description: '25 Komponenten released.', timestamp: '3. Mai 2026', color: 'success' as const, icon: 'check' },
  { title: 'Beta-Feedback', description: 'Nutzertests abgeschlossen, 12 Issues gemeldet.', timestamp: '4. Mai 2026', color: 'warning' as const, icon: 'exclamation-triangle' },
  { title: 'Hotfix deployed', timestamp: '5. Mai 2026', color: 'error' as const },
  { title: 'v1.1 Release', description: '5 neue Komponenten, alle Fixes integriert.', timestamp: '6. Mai 2026', color: 'success' as const, icon: 'rocket-launch' },
];

export const Default: Story = {
  args: { items: sampleItems, orientation: 'vertical', compact: false },
};

export const Compact: Story = {
  args: { items: sampleItems, orientation: 'vertical', compact: true },
};

export const Horizontal: Story = {
  args: {
    items: [
      { title: 'Step 1', description: 'Kickoff', color: 'success' as const },
      { title: 'Step 2', description: 'Development', color: 'success' as const },
      { title: 'Step 3', description: 'Testing', color: 'primary' as const },
      { title: 'Step 4', description: 'Release', color: 'neutral' as const },
    ],
    orientation: 'horizontal',
  },
};

export const MinimalItems: Story = {
  args: {
    items: [
      { title: 'Login', timestamp: '09:15' },
      { title: 'File uploaded', timestamp: '09:22' },
      { title: 'Logout', timestamp: '10:01' },
    ],
  },
};

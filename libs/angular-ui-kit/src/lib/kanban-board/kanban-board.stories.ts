import type { Meta, StoryObj } from '@storybook/angular';
import { KanbanBoardComponent } from './kanban-board.component';

const meta: Meta<KanbanBoardComponent> = {
  title: 'Components/Kanban Board',
  component: KanbanBoardComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Kanban board with drag-and-drop card management. ' +
          'Supports multiple columns, card labels, priorities, assignees, ' +
          'WIP limits, and card count display.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<KanbanBoardComponent>;

export const Default: Story = {
  args: {
    columns: [
      {
        id: 'backlog', title: 'Backlog', color: '#6366f1',
        cards: [
          { id: '1', title: 'Research competitors', labels: [{ text: 'Research', color: '#dbeafe' }] },
          { id: '2', title: 'Design mockups', description: 'Create wireframes for the new dashboard', priority: 'high' },
          { id: '3', title: 'Write documentation', priority: 'low' },
        ],
      },
      {
        id: 'todo', title: 'To Do', color: '#3b82f6', limit: 5,
        cards: [
          { id: '4', title: 'Implement auth flow', priority: 'critical', labels: [{ text: 'Backend', color: '#fef3c7' }], assignee: 'Alice' },
          { id: '5', title: 'Setup CI/CD', priority: 'medium', assignee: 'Bob' },
        ],
      },
      {
        id: 'progress', title: 'In Progress', color: '#f59e0b', limit: 3,
        cards: [
          { id: '6', title: 'API endpoints', description: 'REST API for user management', priority: 'high', assignee: 'Charlie' },
        ],
      },
      {
        id: 'review', title: 'Review', color: '#8b5cf6', limit: 2,
        cards: [
          { id: '7', title: 'Landing page', priority: 'medium', assignee: 'Diana', labels: [{ text: 'Frontend', color: '#d1fae5' }] },
        ],
      },
      {
        id: 'done', title: 'Done', color: '#22c55e',
        cards: [
          { id: '8', title: 'Project setup', assignee: 'Alice' },
          { id: '9', title: 'Database schema', assignee: 'Bob' },
        ],
      },
    ],
  },
};

export const Simple: Story = {
  args: {
    columns: [
      {
        id: 'todo', title: 'To Do',
        cards: [
          { id: '1', title: 'Buy groceries' },
          { id: '2', title: 'Clean house' },
          { id: '3', title: 'Read book' },
        ],
      },
      { id: 'doing', title: 'Doing', cards: [{ id: '4', title: 'Exercise' }] },
      { id: 'done', title: 'Done', cards: [] },
    ],
    showWipLimit: false,
  },
};

export const WithWipOverflow: Story = {
  args: {
    columns: [
      {
        id: 'wip', title: 'In Progress', color: '#f59e0b', limit: 2,
        cards: [
          { id: '1', title: 'Task A', priority: 'high' },
          { id: '2', title: 'Task B', priority: 'medium' },
          { id: '3', title: 'Task C (over limit)', priority: 'low' },
        ],
      },
      {
        id: 'done', title: 'Done', color: '#22c55e',
        cards: [],
      },
    ],
  },
};

export const Readonly: Story = {
  args: {
    columns: [
      {
        id: 'col1', title: 'Column 1',
        cards: [
          { id: '1', title: 'Read-only card', description: 'Cannot be dragged' },
        ],
      },
      { id: 'col2', title: 'Column 2', cards: [] },
    ],
    readonly: true,
  },
};

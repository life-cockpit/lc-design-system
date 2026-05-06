import type { Meta, StoryObj } from '@storybook/angular';
import { DependencyViewerComponent, DependencyNode } from './dependency-viewer.component';

const meta: Meta<DependencyViewerComponent> = {
  title: 'Data Display/Dependency Viewer',
  component: DependencyViewerComponent,
  tags: ['autodocs'],
  argTypes: {
    direction: { control: 'radio', options: ['horizontal', 'vertical'] },
    showToolbar: { control: 'boolean' },
    showEdgeLabels: { control: 'boolean' },
    height: { control: 'text' },
    edgeWidth: { control: { type: 'number', min: 0.5, max: 4, step: 0.5 } },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Dependency viewer for visualizing hierarchical and cross-cutting relationships. ' +
          'Supports horizontal/vertical layout, bidirectional dependencies, relationship types ' +
          '(blocks, references, requires, extends, implements, uses), edge labels, pan & zoom, ' +
          'collapsible sub-trees, and an interactive detail panel.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<DependencyViewerComponent>;

// ── Data ────────────────────────────────────────────────────────────────────

const simpleTree: DependencyNode = {
  id: 'app',
  label: 'App',
  status: 'active',
  description: 'Main application',
  children: [
    { id: 'auth', label: 'Auth Module', status: 'success' },
    {
      id: 'core',
      label: 'Core Module',
      status: 'success',
      children: [
        { id: 'http', label: 'HTTP Client', status: 'default' },
        { id: 'store', label: 'State Store', status: 'default' },
      ],
    },
    { id: 'ui', label: 'UI Kit', status: 'warning' },
  ],
};

const bidirectionalTree: DependencyNode = {
  id: 'api',
  label: 'API Gateway',
  status: 'active',
  description: 'Central API gateway for all services',
  children: [
    {
      id: 'user-svc',
      label: 'User Service',
      status: 'success',
      description: 'Manages user accounts',
      children: [
        { id: 'user-db', label: 'User DB', status: 'default' },
      ],
    },
    {
      id: 'order-svc',
      label: 'Order Service',
      status: 'warning',
      description: 'Handles order processing',
      dependsOn: [
        { id: 'user-svc', relation: 'requires' },
      ],
      children: [
        { id: 'order-db', label: 'Order DB', status: 'default' },
        {
          id: 'payment',
          label: 'Payment',
          status: 'error',
          dependsOn: [{ id: 'user-svc', relation: 'references' }],
        },
      ],
    },
    {
      id: 'notification',
      label: 'Notifications',
      status: 'success',
      dependsOn: [
        { id: 'user-svc', relation: 'depends' },
        { id: 'order-svc', relation: 'blocks' },
      ],
    },
  ],
};

const complexTree: DependencyNode = {
  id: 'platform',
  label: 'Platform',
  status: 'active',
  children: [
    {
      id: 'frontend',
      label: 'Frontend',
      status: 'success',
      dependsOn: [{ id: 'design-system', relation: 'uses' }],
      children: [
        { id: 'dashboard', label: 'Dashboard', status: 'default' },
        { id: 'settings', label: 'Settings', status: 'default', dependsOn: [{ id: 'auth-lib', relation: 'requires' }] },
      ],
    },
    {
      id: 'backend',
      label: 'Backend',
      status: 'success',
      children: [
        { id: 'auth-lib', label: 'Auth Lib', status: 'active' },
        { id: 'data-layer', label: 'Data Layer', status: 'default', dependsOn: [{ id: 'auth-lib', relation: 'extends' }] },
      ],
    },
    {
      id: 'design-system',
      label: 'Design System',
      status: 'warning',
      children: [
        { id: 'tokens', label: 'Tokens', status: 'default' },
        { id: 'components', label: 'Components', status: 'default', dependsOn: [{ id: 'tokens', relation: 'implements' }] },
      ],
    },
  ],
};

// ── Stories ──────────────────────────────────────────────────────────────────

export const Horizontal: Story = {
  args: {
    root: simpleTree,
    direction: 'horizontal',
    height: '400px',
  },
};

export const Vertical: Story = {
  args: {
    root: simpleTree,
    direction: 'vertical',
    height: '500px',
  },
};

export const BidirectionalDependencies: Story = {
  args: {
    root: bidirectionalTree,
    direction: 'horizontal',
    height: '500px',
  },
};

export const BidirectionalVertical: Story = {
  args: {
    root: bidirectionalTree,
    direction: 'vertical',
    height: '600px',
  },
};

export const ComplexRelationships: Story = {
  args: {
    root: complexTree,
    direction: 'horizontal',
    height: '500px',
  },
};

export const NoEdgeLabels: Story = {
  args: {
    root: bidirectionalTree,
    direction: 'horizontal',
    showEdgeLabels: false,
    height: '500px',
  },
};

export const WithoutToolbar: Story = {
  args: {
    root: simpleTree,
    direction: 'horizontal',
    showToolbar: false,
    height: '400px',
  },
};

export const SingleNode: Story = {
  args: {
    root: { id: 'single', label: 'Single Node', status: 'active', description: 'A lone node' },
    height: '200px',
  },
};

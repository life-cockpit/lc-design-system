import type { Meta, StoryObj } from '@storybook/angular';
import { TableComponent } from './table.component';

const meta: Meta<TableComponent> = {
  title: 'Data Display/Table',
  component: TableComponent,
  parameters: {
    docs: {
      description: {
        component: `
The Table component displays structured data in rows and columns.
Supports sorting, variants, empty states, and responsive sizing.

**Key Features:**
- 3 visual variants (default, striped, bordered)
- 3 sizes (sm, md, lg)
- Column-level sort configuration
- Hoverable rows
- Empty state with custom message
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'striped', 'bordered'],
      description: 'Visual style',
      table: { defaultValue: { summary: 'default' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Row density',
      table: { defaultValue: { summary: 'md' } },
    },
    hoverable: { control: 'boolean', description: 'Highlight rows on hover' },
  },
};

export default meta;
type Story = StoryObj<TableComponent>;

const userColumns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'status', label: 'Status' },
];

const userData = [
  { name: 'Alice Johnson', email: 'alice@company.com', role: 'Admin', status: 'Active' },
  { name: 'Bob Smith', email: 'bob@company.com', role: 'Editor', status: 'Active' },
  { name: 'Carol White', email: 'carol@company.com', role: 'Viewer', status: 'Inactive' },
  { name: 'David Brown', email: 'david@company.com', role: 'Editor', status: 'Active' },
  { name: 'Eva Martinez', email: 'eva@company.com', role: 'Admin', status: 'Active' },
];

export const Default: Story = {
  args: { columns: userColumns, data: userData, variant: 'default', size: 'md', hoverable: true },
};

export const Striped: Story = {
  parameters: {
    docs: { description: { story: 'Striped variant alternates row backgrounds for better readability in dense tables.' } },
  },
  args: { columns: userColumns, data: userData, variant: 'striped', size: 'md', hoverable: true },
};

export const Bordered: Story = {
  parameters: {
    docs: { description: { story: 'Bordered variant adds cell borders for strict grid-style tables.' } },
  },
  args: { columns: userColumns, data: userData, variant: 'bordered', size: 'md' },
};

export const Compact: Story = {
  parameters: {
    docs: { description: { story: 'Small size reduces row height for data-dense views.' } },
  },
  args: { columns: userColumns, data: userData, variant: 'default', size: 'sm', hoverable: true },
};

export const Large: Story = {
  parameters: {
    docs: { description: { story: 'Large size increases row height for primary data tables.'},  } },
  args: { columns: userColumns, data: userData, variant: 'default', size: 'lg', hoverable: true },
};

export const Empty: Story = {
  parameters: {
    docs: { description: { story: 'Empty state when no data matches filters or the dataset is empty.' } },
  },
  args: { columns: userColumns, data: [], emptyText: 'No users found. Try adjusting your filters or invite new team members.' },
};

export const ProjectTable: Story = {
  parameters: {
    docs: { description: { story: 'Real-world example: a project list with various data types.' } },
  },
  args: {
    columns: [
      { key: 'name', label: 'Project', sortable: true },
      { key: 'owner', label: 'Owner' },
      { key: 'progress', label: 'Progress', sortable: true },
      { key: 'deadline', label: 'Deadline', sortable: true },
    ],
    data: [
      { name: 'Website Redesign', owner: 'Alice Johnson', progress: '75%', deadline: '2026-05-15' },
      { name: 'Mobile App v2', owner: 'Bob Smith', progress: '40%', deadline: '2026-06-30' },
      { name: 'API Migration', owner: 'Carol White', progress: '90%', deadline: '2026-04-30' },
      { name: 'Analytics Dashboard', owner: 'David Brown', progress: '20%', deadline: '2026-07-15' },
      { name: 'Security Audit', owner: 'Eva Martinez', progress: '100%', deadline: '2026-04-01' },
    ],
    variant: 'default',
    size: 'md',
    hoverable: true,
  },
};

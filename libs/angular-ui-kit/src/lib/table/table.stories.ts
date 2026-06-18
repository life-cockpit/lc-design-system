import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { TableComponent } from './table.component';
import { TableCellDirective } from './table-cell.directive';
import { BadgeComponent } from '../badge/badge.component';
import { AvatarComponent } from '../avatar/avatar.component';
import { ChipComponent } from '../chip/chip.component';
import { ButtonComponent } from '../button/button.component';

const meta: Meta<TableComponent> = {
  title: 'Data Display/Table',
  component: TableComponent,
  decorators: [
    moduleMetadata({
      imports: [
        TableComponent,
        TableCellDirective,
        BadgeComponent,
        AvatarComponent,
        ChipComponent,
        ButtonComponent,
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        component: `
The Table component displays structured data in rows and columns with advanced data management capabilities.

**Key Features:**
- 3 visual variants (default, striped, bordered)
- 3 sizes (sm, md, lg)
- Column-level sort configuration
- Per-column cell formatting via formatter callbacks
- Conditional cell styling via cellClass/cellStyle
- Custom lcTableCell templates for composed cells
- Rich examples with avatars, badges, chips and row actions
- Hoverable rows with click events
- Empty state with custom message
- Pagination with configurable page sizes
- Row selection with select-all checkbox
- Per-column text filtering
- Inline cell editing via double-click
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
    paginate: { control: 'boolean', description: 'Enable pagination' },
    pageSize: { control: 'number', description: 'Rows per page' },
    selectable: { control: 'boolean', description: 'Enable row selection checkboxes' },
    filterable: { control: 'boolean', description: 'Enable per-column text filters' },
    editable: { control: 'boolean', description: 'Enable inline cell editing (double-click)' },
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

// -- Advanced Feature Stories --

const largeDataset = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@company.com`,
  department: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'][i % 5],
  salary: 50000 + Math.floor(Math.random() * 60000),
}));

const largeColumns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email' },
  { key: 'department', label: 'Department', sortable: true },
  { key: 'salary', label: 'Salary', sortable: true },
];

export const WithPagination: Story = {
  parameters: {
    docs: { description: { story: 'Pagination splits large datasets into pages. Configure page size and navigate between pages.' } },
  },
  args: {
    columns: largeColumns,
    data: largeDataset,
    paginate: true,
    pageSize: 10,
    pageSizeOptions: [5, 10, 25, 50],
    variant: 'striped',
    hoverable: true,
  },
};

export const WithSelection: Story = {
  parameters: {
    docs: { description: { story: 'Row selection adds checkboxes for each row and a select-all checkbox in the header. Selected rows are highlighted.' } },
  },
  args: {
    columns: userColumns,
    data: userData,
    selectable: true,
    hoverable: true,
    variant: 'default',
  },
};

export const WithFiltering: Story = {
  parameters: {
    docs: { description: { story: 'Per-column text filters allow users to narrow results. Filters are applied across all columns simultaneously.' } },
  },
  args: {
    columns: largeColumns,
    data: largeDataset,
    filterable: true,
    paginate: true,
    pageSize: 10,
    variant: 'default',
    hoverable: true,
  },
};

export const WithInlineEditing: Story = {
  parameters: {
    docs: { description: { story: 'Double-click any cell to edit its value inline. Press Enter to confirm or Escape to cancel.' } },
  },
  args: {
    columns: [
      { key: 'name', label: 'Name', sortable: true, editable: true },
      { key: 'email', label: 'Email', editable: true },
      { key: 'role', label: 'Role', editable: true },
      { key: 'status', label: 'Status', editable: true },
    ],
    data: userData,
    editable: true,
    hoverable: true,
    variant: 'bordered',
  },
};

export const WithCellFormatting: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Define a formatter per column to format values (for example currency, dates, or labels) without writing custom templates.',
      },
    },
  },
  args: {
    columns: [
      { key: 'invoice', label: 'Invoice', sortable: true },
      {
        key: 'total',
        label: 'Total',
        sortable: true,
        formatter: (value: unknown) =>
          new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(
            Number(value ?? 0)
          ),
      },
      {
        key: 'dueDate',
        label: 'Due Date',
        sortable: true,
        formatter: (value: unknown) =>
          new Intl.DateTimeFormat('de-DE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          }).format(new Date(String(value))),
      },
      {
        key: 'status',
        label: 'Status',
        formatter: (value: unknown) => String(value).toUpperCase(),
      },
    ],
    data: [
      { invoice: 'INV-2026-001', total: 1250.5, dueDate: '2026-07-01', status: 'open' },
      { invoice: 'INV-2026-002', total: 990, dueDate: '2026-07-15', status: 'paid' },
      { invoice: 'INV-2026-003', total: 4020.75, dueDate: '2026-08-01', status: 'overdue' },
    ],
    variant: 'striped',
    hoverable: true,
  },
};

export const WithCellFormattingAndStyling: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Combine formatter callbacks with cellClass/cellStyle to highlight KPI states directly in the table.',
      },
    },
  },
  render: () => ({
    props: {
      columns: [
        { key: 'account', label: 'Account', sortable: true },
        {
          key: 'arr',
          label: 'ARR',
          sortable: true,
          cellClass: 'lc-table-story__cell--numeric',
          formatter: (value: unknown) =>
            new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(
              Number(value ?? 0)
            ),
        },
        {
          key: 'margin',
          label: 'Margin',
          sortable: true,
          formatter: (value: unknown) => `${Number(value ?? 0).toFixed(1)}%`,
          cellClass: (value: unknown) => {
            const numberValue = Number(value ?? 0);
            if (numberValue < 10) return 'lc-table-story__cell--danger';
            if (numberValue < 20) return 'lc-table-story__cell--warning';
            return 'lc-table-story__cell--success';
          },
          cellStyle: { fontWeight: '700' },
        },
        {
          key: 'sla',
          label: 'SLA',
          sortable: true,
          formatter: (value: unknown) => `${Number(value ?? 0).toFixed(2)}%`,
          cellClass: 'lc-table-story__cell--numeric',
          cellStyle: (value: unknown) => ({
            opacity: Number(value ?? 0) < 99.0 ? '0.85' : '1',
          }),
        },
      ],
      data: [
        { account: 'Acme GmbH', arr: 185000, margin: 23.4, sla: 99.82 },
        { account: 'Nova Health', arr: 123500, margin: 14.2, sla: 99.12 },
        { account: 'Orbit Labs', arr: 87000, margin: 7.8, sla: 98.74 },
      ],
    },
    template: `
      <style>
        .lc-table-story__cell--numeric {
          text-align: right;
          font-variant-numeric: tabular-nums;
        }

        .lc-table-story__cell--success {
          color: #047857;
        }

        .lc-table-story__cell--warning {
          color: #b45309;
        }

        .lc-table-story__cell--danger {
          color: #b91c1c;
        }
      </style>

      <lc-table [columns]="columns" [data]="data" variant="striped" [hoverable]="true" size="md"></lc-table>
    `,
  }),
};

export const WithBadgesAndAvatars: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Richer table cells with `lc-avatar` and `lc-badge` via `lcTableCell` templates. Use this style for user/admin lists.',
      },
    },
  },
  render: () => ({
    props: {
      columns: [
        { key: 'user', label: 'User', sortable: true },
        { key: 'team', label: 'Team', sortable: true },
        {
          key: 'mrr',
          label: 'MRR',
          sortable: true,
          formatter: (value: unknown) =>
            new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(
              Number(value ?? 0)
            ),
        },
        { key: 'status', label: 'Status', sortable: true },
        {
          key: 'lastSeen',
          label: 'Last Seen',
          sortable: true,
          formatter: (value: unknown) =>
            new Intl.DateTimeFormat('de-DE', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            }).format(new Date(String(value))),
        },
      ],
      data: [
        {
          user: 'Alice Johnson',
          email: 'alice@company.com',
          avatar: '',
          avatarStatus: 'online',
          team: 'Platform',
          mrr: 12500,
          status: 'active',
          lastSeen: '2026-06-17',
        },
        {
          user: 'Bob Smith',
          email: 'bob@company.com',
          avatar: '',
          avatarStatus: 'away',
          team: 'Sales',
          mrr: 8700,
          status: 'trial',
          lastSeen: '2026-06-16',
        },
        {
          user: 'Carol White',
          email: 'carol@company.com',
          avatar: '',
          avatarStatus: 'busy',
          team: 'Support',
          mrr: 4300,
          status: 'at risk',
          lastSeen: '2026-06-14',
        },
        {
          user: 'David Brown',
          email: 'david@company.com',
          avatar: '',
          avatarStatus: 'offline',
          team: 'Engineering',
          mrr: 15200,
          status: 'inactive',
          lastSeen: '2026-06-02',
        },
      ],
      statusVariant: (status: unknown) => {
        const normalized = String(status ?? '').toLowerCase();
        switch (normalized) {
          case 'active':
            return 'success';
          case 'trial':
            return 'info';
          case 'at risk':
            return 'warning';
          case 'inactive':
            return 'default';
          default:
            return 'default';
        }
      },
      statusLabel: (status: unknown) => {
        const value = String(status ?? '');
        return value ? value.charAt(0).toUpperCase() + value.slice(1) : '-';
      },
    },
    template: `
      <lc-table [columns]="columns" [data]="data" variant="striped" [hoverable]="true" size="md">
        <ng-template lcTableCell="user" let-row>
          <div style="display:flex; align-items:center; gap:10px; min-width:220px;">
            <lc-avatar
              [name]="row.user"
              [status]="row.avatarStatus"
              size="sm"
              [src]="row.avatar"
            ></lc-avatar>
            <div style="display:flex; flex-direction:column; line-height:1.2;">
              <span style="font-weight:600; color: var(--lc-text-primary, #1f2937);">{{ row.user }}</span>
              <span style="font-size:12px; color: var(--lc-text-secondary, #6b7280);">{{ row.email }}</span>
            </div>
          </div>
        </ng-template>

        <ng-template lcTableCell="status" let-row>
          <lc-badge [variant]="statusVariant(row.status)" size="sm">
            {{ statusLabel(row.status) }}
          </lc-badge>
        </ng-template>
      </lc-table>
    `,
  }),
};

export const EnterpriseUsers: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Premium example with composed cells: avatar profiles, team chips, status badges, trend indicator and row actions.',
      },
    },
  },
  render: () => ({
    props: {
      columns: [
        { key: 'user', label: 'User', sortable: true, width: '280px' },
        { key: 'team', label: 'Team', sortable: true, width: '140px' },
        {
          key: 'arr',
          label: 'ARR',
          sortable: true,
          formatter: (value: unknown) =>
            new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(
              Number(value ?? 0)
            ),
        },
        { key: 'status', label: 'Status', sortable: true, width: '130px' },
        { key: 'trend', label: 'Trend', sortable: true, width: '120px' },
        {
          key: 'renewal',
          label: 'Renewal',
          sortable: true,
          formatter: (value: unknown) =>
            new Intl.DateTimeFormat('de-DE', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            }).format(new Date(String(value))),
        },
        { key: 'actions', label: 'Actions', width: '190px' },
      ],
      data: [
        {
          user: 'Alice Johnson',
          email: 'alice@company.com',
          avatarStatus: 'online',
          team: 'Platform',
          arr: 182400,
          status: 'healthy',
          trend: 8.2,
          renewal: '2026-11-30',
        },
        {
          user: 'Ben Carter',
          email: 'ben@company.com',
          avatarStatus: 'away',
          team: 'Sales',
          arr: 141600,
          status: 'watch',
          trend: -1.5,
          renewal: '2026-09-15',
        },
        {
          user: 'Carla Mendes',
          email: 'carla@company.com',
          avatarStatus: 'busy',
          team: 'Support',
          arr: 97800,
          status: 'risk',
          trend: -6.9,
          renewal: '2026-08-10',
        },
      ],
      statusVariant: (status: unknown) => {
        const normalized = String(status ?? '').toLowerCase();
        switch (normalized) {
          case 'healthy':
            return 'success';
          case 'watch':
            return 'warning';
          case 'risk':
            return 'error';
          default:
            return 'default';
        }
      },
      statusLabel: (status: unknown) => {
        const value = String(status ?? '');
        return value ? value.charAt(0).toUpperCase() + value.slice(1) : '-';
      },
      teamVariant: (team: unknown) => {
        const normalized = String(team ?? '').toLowerCase();
        switch (normalized) {
          case 'platform':
            return 'primary';
          case 'sales':
            return 'info';
          case 'support':
            return 'warning';
          default:
            return 'default';
        }
      },
      trendColor: (trend: unknown) => (Number(trend ?? 0) >= 0 ? '#047857' : '#b91c1c'),
      trendPrefix: (trend: unknown) => (Number(trend ?? 0) >= 0 ? '+' : ''),
      onDetails: (row: Record<string, unknown>) => {
        // Demo handler for Storybook interaction
        console.info('Details clicked', row);
      },
      onSuspend: (row: Record<string, unknown>) => {
        // Demo handler for Storybook interaction
        console.info('Suspend clicked', row);
      },
    },
    template: `
      <lc-table [columns]="columns" [data]="data" variant="bordered" [hoverable]="true" size="md">
        <ng-template lcTableCell="user" let-row>
          <div style="display:flex; align-items:center; gap:10px; min-width:250px;">
            <lc-avatar [name]="row.user" [status]="row.avatarStatus" size="sm"></lc-avatar>
            <div style="display:flex; flex-direction:column; line-height:1.2;">
              <span style="font-weight:600; color: var(--lc-text-primary, #1f2937);">{{ row.user }}</span>
              <span style="font-size:12px; color: var(--lc-text-secondary, #6b7280);">{{ row.email }}</span>
            </div>
          </div>
        </ng-template>

        <ng-template lcTableCell="team" let-row>
          <lc-chip [variant]="teamVariant(row.team)" size="sm">{{ row.team }}</lc-chip>
        </ng-template>

        <ng-template lcTableCell="status" let-row>
          <lc-badge [variant]="statusVariant(row.status)" size="sm">{{ statusLabel(row.status) }}</lc-badge>
        </ng-template>

        <ng-template lcTableCell="trend" let-row>
          <span [style.color]="trendColor(row.trend)" style="font-weight:600;">
            {{ trendPrefix(row.trend) }}{{ row.trend }}%
          </span>
        </ng-template>

        <ng-template lcTableCell="actions" let-row>
          <div style="display:flex; gap:8px;">
            <lc-button variant="ghost" size="xs" (clicked)="onDetails(row)">Details</lc-button>
            <lc-button variant="outline" size="xs" (clicked)="onSuspend(row)">Suspend</lc-button>
          </div>
        </ng-template>
      </lc-table>
    `,
  }),
};

export const FullFeatured: Story = {
  parameters: {
    docs: { description: { story: 'All advanced features combined: pagination, selection, filtering, and inline editing.' } },
  },
  args: {
    columns: [
      { key: 'id', label: 'ID', sortable: true, editable: false },
      { key: 'name', label: 'Name', sortable: true, editable: true },
      { key: 'email', label: 'Email', editable: true },
      { key: 'department', label: 'Department', sortable: true, editable: true },
      { key: 'salary', label: 'Salary', sortable: true, editable: true },
    ],
    data: largeDataset,
    paginate: true,
    pageSize: 10,
    pageSizeOptions: [5, 10, 25],
    selectable: true,
    filterable: true,
    editable: true,
    hoverable: true,
    variant: 'striped',
    size: 'md',
  },
};

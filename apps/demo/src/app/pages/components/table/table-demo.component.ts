import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TableComponent,
  TableColumn,
  SortEvent,
  TableVariant,
  TableSize,
  TableCellDirective,
  ButtonComponent,
  BadgeComponent,
} from '@life-cockpit/ui-kit';

interface User extends Record<string, unknown> {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastActive: string;
}

@Component({
  selector: 'app-table-demo',
  standalone: true,
  imports: [CommonModule, TableComponent, TableCellDirective, ButtonComponent, BadgeComponent],
  templateUrl: './table-demo.component.html',
  styleUrl: './table-demo.component.scss',
})
export class TableDemoComponent {
  // Demo data
  users = signal<User[]>([
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice@example.com',
      role: 'Admin',
      status: 'active',
      lastActive: '2 mins ago',
    },
    {
      id: 2,
      name: 'Bob Smith',
      email: 'bob@example.com',
      role: 'Editor',
      status: 'active',
      lastActive: '1 hour ago',
    },
    {
      id: 3,
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      role: 'Viewer',
      status: 'inactive',
      lastActive: '3 days ago',
    },
    {
      id: 4,
      name: 'Diana Prince',
      email: 'diana@example.com',
      role: 'Editor',
      status: 'active',
      lastActive: '5 mins ago',
    },
    {
      id: 5,
      name: 'Ethan Hunt',
      email: 'ethan@example.com',
      role: 'Viewer',
      status: 'pending',
      lastActive: 'Never',
    },
  ]);

  sortedUsers = signal<User[]>([...this.users()]);

  // Column definitions
  columns = signal<TableColumn[]>([
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'status', label: 'Status', sortable: false },
    { key: 'lastActive', label: 'Last Active', sortable: true },
  ]);

  // Props API columns
  apiColumns = signal<TableColumn[]>([
    { key: 'prop', label: 'Property', sortable: false },
    { key: 'type', label: 'Type', sortable: false },
    { key: 'default', label: 'Default', sortable: false },
    { key: 'description', label: 'Description', sortable: false },
  ]);

  apiData = signal([
    {
      prop: 'columns',
      type: 'TableColumn[]',
      default: '[]',
      description: 'Array of column definitions with key, label, and sortable',
    },
    {
      prop: 'data',
      type: 'any[]',
      default: '[]',
      description: 'Array of data objects to display in rows',
    },
    {
      prop: 'variant',
      type: "'default' | 'striped' | 'bordered'",
      default: "'default'",
      description: 'Visual style variant of the table',
    },
    {
      prop: 'size',
      type: "'sm' | 'md' | 'lg'",
      default: "'md'",
      description: 'Size of the table (affects padding and font size)',
    },
    {
      prop: 'hoverable',
      type: 'boolean',
      default: 'false',
      description: 'Enable hover effect on table rows',
    },
    {
      prop: 'responsive',
      type: 'boolean',
      default: 'true',
      description: 'Enable responsive horizontal scrolling on narrow screens',
    },
  ]);

  eventsData = signal([
    {
      prop: 'sort',
      type: 'SortEvent',
      description:
        'Emitted when a sortable column header is clicked. Contains {column: string, direction: "asc" | "desc"}',
    },
  ]);

  // Playground controls
  selectedVariant = signal<TableVariant>('default');
  selectedSize = signal<TableSize>('md');
  isHoverable = signal(false);
  isResponsive = signal(true);

  // Handle sort events
  onSort(event: SortEvent): void {
    const { column, direction } = event;
    const sorted = [...this.users()].sort((a, b) => {
      const aVal = a[column as keyof User];
      const bVal = b[column as keyof User];

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return direction === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      return direction === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });

    this.sortedUsers.set(sorted);
  }

  // Playground actions
  setVariant(variant: TableVariant): void {
    this.selectedVariant.set(variant);
  }

  setSize(size: TableSize): void {
    this.selectedSize.set(size);
  }

  toggleHoverable(): void {
    this.isHoverable.update((v) => !v);
  }

  toggleResponsive(): void {
    this.isResponsive.update((v) => !v);
  }

  // Get badge variant based on status
  getStatusVariant(
    status: string,
  ): 'default' | 'primary' | 'success' | 'error' | 'warning' | 'info' {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  }
}

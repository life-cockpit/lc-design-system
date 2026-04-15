import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
  signal,
  ContentChildren,
  QueryList,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableCellDirective } from './table-cell.directive';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  /** Optional CSS class(es) applied to both th and td cells */
  cssClass?: string;
  /** Optional tooltip shown on hover over the column header */
  tooltip?: string;
}

export interface SortEvent {
  column: string;
  direction: 'asc' | 'desc';
}

export type TableVariant = 'default' | 'striped' | 'bordered';
export type TableSize = 'sm' | 'md' | 'lg';

/**
 * Table Component
 *
 * A flexible, accessible data table component with sorting, variants, and responsive behavior.
 *
 * @example
 * ```html
 * <lc-table
 *   [columns]="columns"
 *   [data]="data"
 *   variant="striped"
 *   [hoverable]="true"
 *   (sort)="onSort($event)">
 * </lc-table>
 *
 * <!-- With custom cell templates -->
 * <lc-table [columns]="columns" [data]="data">
 *   <ng-template lcTableCell="status" let-row>
 *     <lc-badge [variant]="row.status">{{ row.status }}</lc-badge>
 *   </ng-template>
 * </lc-table>
 * ```
 */
@Component({
  selector: 'lc-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent {
  /** Custom cell templates */
  @ContentChildren(TableCellDirective) cellTemplates!: QueryList<TableCellDirective>;

  /** Array of column definitions */
  columns = input<TableColumn[]>([]);

  /** Array of data objects to display */
  data = input<Record<string, unknown>[]>([]);

  /** Visual variant of the table */
  variant = input<TableVariant>('default');

  /** Size of the table */
  size = input<TableSize>('md');

  /** Whether rows should highlight on hover */
  hoverable = input<boolean>(false);

  /** Whether table should be responsive (horizontal scroll on mobile) */
  responsive = input<boolean>(true);

  /** Text shown when data is empty */
  emptyText = input<string>('No data available');

  /** Emitted when a sortable column header is clicked */
  readonly sort = output<SortEvent>();

  /** Emitted when a row is clicked */
  readonly rowClick = output<Record<string, unknown>>();

  /**
   * Computed CSS classes for the table element
   */
  tableClasses = computed(() => {
    const classes = ['lc-table'];

    classes.push(`lc-table--${this.variant()}`);
    classes.push(`lc-table--${this.size()}`);

    if (this.hoverable()) {
      classes.push('lc-table--hoverable');
    }

    return classes.join(' ');
  });

  /**
   * Computed CSS classes for the wrapper element
   */
  wrapperClasses = computed(() => {
    const classes = ['lc-table-wrapper'];

    if (this.responsive()) {
      classes.push('lc-table-wrapper--responsive');
    }

    return classes.join(' ');
  });

  /** Current sort state */
  protected currentSort = signal<{ column: string; direction: 'asc' | 'desc' } | null>(null);

  /**
   * Handle click on a sortable column header
   */
  handleSort(columnKey: string): void {
    const column = this.columns().find((col) => col.key === columnKey);

    if (!column || !column.sortable) {
      return;
    }

    const current = this.currentSort();
    let direction: 'asc' | 'desc' = 'asc';

    if (current && current.column === columnKey) {
      direction = current.direction === 'asc' ? 'desc' : 'asc';
    }

    this.currentSort.set({ column: columnKey, direction });
    this.sort.emit({ column: columnKey, direction });
  }

  /**
   * Get sort state for a column
   */
  getSortState(columnKey: string): 'asc' | 'desc' | null {
    const current = this.currentSort();
    if (current && current.column === columnKey) {
      return current.direction;
    }
    return null;
  }

  /**
   * Get aria-sort attribute value for a column
   */
  getAriaSort(columnKey: string): string | null {
    const sortState = this.getSortState(columnKey);
    if (sortState === 'asc') return 'ascending';
    if (sortState === 'desc') return 'descending';
    return null;
  }

  /**
   * Get CSS classes for a header cell
   */
  getHeaderClasses(column: TableColumn): string {
    const classes: string[] = [];

    if (column.sortable) {
      classes.push('sortable');
    }

    const sortState = this.getSortState(column.key);
    if (sortState) {
      classes.push(`sorted-${sortState}`);
    }

    return classes.join(' ');
  }

  /**
   * Get value from data object by column key
   */
  getCellValue(row: Record<string, unknown>, columnKey: string): unknown {
    return row[columnKey];
  }

  /**
   * Get custom template for a column if it exists
   */
  getCellTemplate(columnKey: string): TableCellDirective | undefined {
    return this.cellTemplates?.find((template) => template.columnKey === columnKey);
  }

  /**
   * Check if a column has a custom template
   */
  hasCustomTemplate(columnKey: string): boolean {
    return !!this.getCellTemplate(columnKey);
  }

  /**
   * Handle row click
   */
  onRowClick(row: Record<string, unknown>): void {
    this.rowClick.emit(row);
  }
}

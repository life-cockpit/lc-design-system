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
import { NgStyle, NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableCellDirective } from './table-cell.directive';
import { InputComponent } from '../input/input.component';
import { SelectComponent } from '../select/select.component';

type TableCellClass = string | ((
  value: unknown,
  row: Record<string, unknown>,
  column: TableColumn,
  rowIndex: number
) => string);

type TableCellStyle = Record<string, string> | ((
  value: unknown,
  row: Record<string, unknown>,
  column: TableColumn,
  rowIndex: number
) => Record<string, string>);

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  editable?: boolean;
  width?: string;
  /** Optional CSS class(es) applied to both th and td cells */
  cssClass?: string;
  /** Optional CSS class(es) for td cells only (string or resolver callback) */
  cellClass?: TableCellClass;
  /** Optional inline styles for td cells only (object or resolver callback) */
  cellStyle?: TableCellStyle;
  /** Optional tooltip shown on hover over the column header */
  tooltip?: string;
  /** Optional formatter for cell output when no custom template is used */
  formatter?: (
    value: unknown,
    row: Record<string, unknown>,
    column: TableColumn,
    rowIndex: number
  ) => unknown;
  /** Input type for inline editing (default: text) */
  editType?: 'text' | 'number' | 'select';
  /** Options for select edit type */
  editOptions?: string[];
}

export interface SortEvent {
  column: string;
  direction: 'asc' | 'desc';
}

export interface CellEditEvent {
  row: Record<string, unknown>;
  column: string;
  oldValue: unknown;
  newValue: unknown;
  rowIndex: number;
}

export interface SelectionChangeEvent {
  selected: Record<string, unknown>[];
  allSelected: boolean;
}

export type TableVariant = 'default' | 'striped' | 'bordered';
export type TableSize = 'sm' | 'md' | 'lg';

/**
 * Table component for displaying structured data in rows and columns.
 *
 * Features:
 * - Column-based sorting with sort direction indicators
 * - Variant styles (default, striped, bordered)
 * - Size presets (sm, md, lg)
 * - Hoverable row highlighting
 * - Per-column formatter callbacks for display values
 * - Per-cell class/style callbacks for conditional styling
 * - Custom cell templates via content projection
 * - Composed cells (e.g. avatar + badge + actions)
 * - Responsive horizontal scrolling
 * - Empty state text for no data
 * - Accessible with proper table semantics
 *
 * @example
 * ```html
 * <lc-table [columns]="columns" [data]="data" variant="striped" [hoverable]="true"
 *   (sort)="onSort($event)" (rowClick)="onRowClick($event)" />
 * ```
 *
 * @example
 * ```ts
 * columns: TableColumn[] = [
 *   {
 *     key: 'amount',
 *     label: 'Amount',
 *     formatter: (value) => new Intl.NumberFormat('de-DE', {
 *       style: 'currency',
 *       currency: 'EUR',
 *     }).format(Number(value ?? 0)),
 *   },
 * ];
 * ```
 */
@Component({
  selector: 'lc-table',
  standalone: true,
  imports: [NgTemplateOutlet, NgStyle, FormsModule, SelectComponent, InputComponent],
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

  // -- Pagination --
  /** Enable pagination */
  paginate = input<boolean>(false);

  /** Rows per page */
  pageSize = input<number>(10);

  /** Available page size options */
  pageSizeOptions = input<number[]>([5, 10, 25, 50]);

  // -- Selection --
  /** Enable row selection checkboxes */
  selectable = input<boolean>(false);

  // -- Column Filters --
  /** Enable per-column text filters */
  filterable = input<boolean>(false);

  // -- Inline Editing --
  /** Enable inline cell editing on double-click */
  editable = input<boolean>(false);

  /** Emitted when a sortable column header is clicked */
  readonly sort = output<SortEvent>();

  /** Emitted when a row is clicked */
  readonly rowClick = output<Record<string, unknown>>();

  /** Emitted when a cell is edited */
  readonly cellEdit = output<CellEditEvent>();

  /** Emitted when row selection changes */
  readonly selectionChange = output<SelectionChangeEvent>();

  // -- Internal state --
  protected currentSort = signal<{ column: string; direction: 'asc' | 'desc' } | null>(null);
  protected currentPage = signal(0);
  protected internalPageSize = signal(10);
  protected selectedRows = signal<Set<number>>(new Set());
  protected columnFilters = signal<Record<string, string>>({});
  protected editingCell = signal<{ rowIndex: number; column: string } | null>(null);
  protected editValue = signal<string>('');

  /**
   * Filtered data (applies column filters)
   */
  protected readonly filteredData = computed(() => {
    let items = this.data();
    const filters = this.columnFilters();

    if (this.filterable()) {
      for (const [key, value] of Object.entries(filters)) {
        if (value.trim()) {
          items = items.filter(row =>
            String(row[key] ?? '').toLowerCase().includes(value.toLowerCase())
          );
        }
      }
    }

    return items;
  });

  /**
   * Sorted data
   */
  protected readonly sortedData = computed(() => {
    const items = [...this.filteredData()];
    const sortState = this.currentSort();
    if (!sortState) return items;

    return items.sort((a, b) => {
      const aVal = a[sortState.column];
      const bVal = b[sortState.column];
      let cmp = 0;
      if (aVal == null && bVal == null) cmp = 0;
      else if (aVal == null) cmp = -1;
      else if (bVal == null) cmp = 1;
      else if (typeof aVal === 'number' && typeof bVal === 'number') cmp = aVal - bVal;
      else cmp = String(aVal).localeCompare(String(bVal));
      return sortState.direction === 'asc' ? cmp : -cmp;
    });
  });

  /**
   * Paginated data (or all if pagination disabled)
   */
  protected readonly displayData = computed(() => {
    const items = this.sortedData();
    if (!this.paginate()) return items;
    const ps = this.internalPageSize();
    const start = this.currentPage() * ps;
    return items.slice(start, start + ps);
  });

  /** Total pages */
  protected readonly totalPages = computed(() => {
    if (!this.paginate()) return 1;
    return Math.max(1, Math.ceil(this.filteredData().length / this.internalPageSize()));
  });

  /** Total filtered row count */
  protected readonly totalRows = computed(() => this.filteredData().length);

  /** Whether all visible rows are selected */
  protected readonly allSelected = computed(() => {
    const data = this.displayData();
    if (data.length === 0) return false;
    const selected = this.selectedRows();
    return data.every((_, i) => selected.has(this.getAbsoluteIndex(i)));
  });

  protected readonly pageSizeSelectOptions = computed(() =>
    this.pageSizeOptions().map((opt) => ({
      value: opt,
      label: `${opt} / page`,
    }))
  );

  /**
   * Computed CSS classes for the table element
   */
  tableClasses = computed(() => {
    const classes = ['lc-table'];
    classes.push(`lc-table--${this.variant()}`);
    classes.push(`lc-table--${this.size()}`);
    if (this.hoverable()) classes.push('lc-table--hoverable');
    return classes.join(' ');
  });

  /**
   * Computed CSS classes for the wrapper element
   */
  wrapperClasses = computed(() => {
    const classes = ['lc-table-wrapper'];
    if (this.responsive()) classes.push('lc-table-wrapper--responsive');
    return classes.join(' ');
  });

  // -- Sort --
  handleSort(columnKey: string): void {
    const column = this.columns().find((col) => col.key === columnKey);
    if (!column || !column.sortable) return;

    const current = this.currentSort();
    let direction: 'asc' | 'desc' = 'asc';
    if (current && current.column === columnKey) {
      direction = current.direction === 'asc' ? 'desc' : 'asc';
    }

    this.currentSort.set({ column: columnKey, direction });
    this.sort.emit({ column: columnKey, direction });
  }

  getSortState(columnKey: string): 'asc' | 'desc' | null {
    const current = this.currentSort();
    if (current && current.column === columnKey) return current.direction;
    return null;
  }

  getAriaSort(columnKey: string): string | null {
    const sortState = this.getSortState(columnKey);
    if (sortState === 'asc') return 'ascending';
    if (sortState === 'desc') return 'descending';
    return null;
  }

  getHeaderClasses(column: TableColumn): string {
    const classes: string[] = [];
    if (column.sortable) classes.push('sortable');
    const sortState = this.getSortState(column.key);
    if (sortState) classes.push(`sorted-${sortState}`);
    return classes.join(' ');
  }

  getCellValue(row: Record<string, unknown>, columnKey: string): unknown {
    return row[columnKey];
  }

  getFormattedCellValue(
    row: Record<string, unknown>,
    column: TableColumn,
    relativeRowIndex: number
  ): unknown {
    const value = this.getCellValue(row, column.key);
    if (!column.formatter) return value;

    return column.formatter(value, row, column, this.getAbsoluteIndex(relativeRowIndex));
  }

  getCellClasses(
    row: Record<string, unknown>,
    column: TableColumn,
    relativeRowIndex: number
  ): string {
    const classes: string[] = [];
    if (column.cssClass) classes.push(column.cssClass);

    if (typeof column.cellClass === 'string') {
      classes.push(column.cellClass);
    } else if (typeof column.cellClass === 'function') {
      const resolved = column.cellClass(
        this.getCellValue(row, column.key),
        row,
        column,
        this.getAbsoluteIndex(relativeRowIndex)
      );
      if (resolved) classes.push(resolved);
    }

    return classes.join(' ').trim();
  }

  getCellStyles(
    row: Record<string, unknown>,
    column: TableColumn,
    relativeRowIndex: number
  ): Record<string, string> | null {
    if (!column.cellStyle) return null;

    if (typeof column.cellStyle === 'function') {
      return column.cellStyle(
        this.getCellValue(row, column.key),
        row,
        column,
        this.getAbsoluteIndex(relativeRowIndex)
      );
    }

    return column.cellStyle;
  }

  getCellTemplate(columnKey: string): TableCellDirective | undefined {
    return this.cellTemplates?.find((template) => template.columnKey() === columnKey);
  }

  hasCustomTemplate(columnKey: string): boolean {
    return !!this.getCellTemplate(columnKey);
  }

  onRowClick(row: Record<string, unknown>): void {
    this.rowClick.emit(row);
  }

  // -- Pagination --
  protected goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  protected onPageSizeChange(event: Event): void {
    const newSize = Number((event.target as HTMLSelectElement).value);
    this.internalPageSize.set(newSize);
    this.currentPage.set(0);
  }

  protected onPageSizeModelChange(value: string | number | null): void {
    if (value == null) {
      return;
    }
    const parsed = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(parsed)) {
      return;
    }
    this.internalPageSize.set(parsed);
    this.currentPage.set(0);
  }

  protected get paginationStart(): number {
    return this.currentPage() * this.internalPageSize() + 1;
  }

  protected get paginationEnd(): number {
    return Math.min((this.currentPage() + 1) * this.internalPageSize(), this.totalRows());
  }

  // -- Selection --
  protected toggleSelectAll(): void {
    const selected = new Set(this.selectedRows());
    const data = this.displayData();
    const allSelected = this.allSelected();

    data.forEach((_, i) => {
      const absIdx = this.getAbsoluteIndex(i);
      if (allSelected) selected.delete(absIdx);
      else selected.add(absIdx);
    });

    this.selectedRows.set(selected);
    this.emitSelectionChange();
  }

  protected toggleRowSelect(relativeIndex: number): void {
    const absIdx = this.getAbsoluteIndex(relativeIndex);
    const selected = new Set(this.selectedRows());
    if (selected.has(absIdx)) selected.delete(absIdx);
    else selected.add(absIdx);
    this.selectedRows.set(selected);
    this.emitSelectionChange();
  }

  protected isRowSelected(relativeIndex: number): boolean {
    return this.selectedRows().has(this.getAbsoluteIndex(relativeIndex));
  }

  private getAbsoluteIndex(relativeIndex: number): number {
    if (!this.paginate()) return relativeIndex;
    return this.currentPage() * this.internalPageSize() + relativeIndex;
  }

  private emitSelectionChange(): void {
    const data = this.data();
    const selected = Array.from(this.selectedRows()).map(i => data[i]).filter(Boolean);
    this.selectionChange.emit({ selected, allSelected: this.allSelected() });
  }

  // -- Column Filters --
  protected onFilterChange(columnKey: string, value: string): void {
    const filters = { ...this.columnFilters(), [columnKey]: value };
    this.columnFilters.set(filters);
    this.currentPage.set(0);
  }

  protected getFilterValue(columnKey: string): string {
    return this.columnFilters()[columnKey] || '';
  }

  // -- Inline Editing --
  protected startEdit(rowIndex: number, column: string, currentValue: unknown): void {
    if (!this.editable()) return;
    const col = this.columns().find(c => c.key === column);
    if (col && col.editable === false) return;
    this.editingCell.set({ rowIndex, column });
    this.editValue.set(String(currentValue ?? ''));
  }

  protected isEditing(rowIndex: number, column: string): boolean {
    const cell = this.editingCell();
    return cell !== null && cell.rowIndex === rowIndex && cell.column === column;
  }

  protected commitEdit(rowIndex: number, column: string): void {
    const absIdx = this.getAbsoluteIndex(rowIndex);
    const row = this.data()[absIdx];
    if (!row) return;
    const oldValue = row[column];
    const newValue = this.editValue();
    this.editingCell.set(null);
    if (String(oldValue ?? '') !== newValue) {
      this.cellEdit.emit({ row, column, oldValue, newValue, rowIndex: absIdx });
    }
  }

  protected cancelEdit(): void {
    this.editingCell.set(null);
  }

  protected onEditKeydown(event: KeyboardEvent, rowIndex: number, column: string): void {
    if (event.key === 'Enter') {
      this.commitEdit(rowIndex, column);
    } else if (event.key === 'Escape') {
      this.cancelEdit();
    }
  }

  protected getInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }
}

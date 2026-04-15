import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type PaginationSize = 'sm' | 'md' | 'lg';

/**
 * Pagination component for navigating through pages of content.
 *
 * Features:
 * - Configurable page size
 * - Previous/Next navigation
 * - Direct page number access
 * - Ellipsis for large page ranges
 * - Size variants (sm, md, lg)
 * - Accessible with ARIA attributes
 * - Optional item count display
 *
 * @example
 * ```html
 * <lc-pagination
 *   [currentPageInput]="currentPage"
 *   [totalItemsInput]="totalItems"
 *   [pageSizeInput]="10"
 *   (pageChange)="onPageChange($event)"
 * ></lc-pagination>
 * ```
 */
@Component({
  selector: 'lc-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  // Signals for reactive state
  currentPage = signal<number>(1);
  totalItems = signal<number>(0);
  pageSize = signal<number>(10);
  size = signal<PaginationSize>('md');
  maxVisiblePages = signal<number>(7);
  ariaLabel = signal<string>('Pagination');
  showInfo = signal<boolean>(false);

  // Event emitters
  @Output() readonly pageChange = new EventEmitter<number>();

  // Computed properties
  totalPages = computed(() => {
    const total = this.totalItems();
    const size = this.pageSize();
    return total > 0 ? Math.ceil(total / size) : 0;
  });

  firstItemIndex = computed(() => {
    const page = this.currentPage();
    const size = this.pageSize();
    return (page - 1) * size + 1;
  });

  lastItemIndex = computed(() => {
    const page = this.currentPage();
    const size = this.pageSize();
    const total = this.totalItems();
    const lastIndex = page * size;
    return Math.min(lastIndex, total);
  });

  isFirstPage = computed(() => this.currentPage() === 1);

  isLastPage = computed(() => this.currentPage() === this.totalPages());

  paginationClasses = computed(() => {
    const classes = ['lc-pagination'];
    classes.push(`lc-pagination--${this.size()}`);
    return classes.join(' ');
  });

  /**
   * Calculate visible page numbers with ellipsis support
   * Returns an array where -1 represents an ellipsis
   */
  visiblePages = computed(() => {
    const current = this.currentPage();
    const total = this.totalPages();
    const maxVisible = this.maxVisiblePages();

    if (total <= maxVisible) {
      // Show all pages if total is less than max visible
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: number[] = [];
    const sidePages = Math.floor((maxVisible - 3) / 2); // Reserve spots for first, last, and ellipsis

    // Always show first page
    pages.push(1);

    if (current <= sidePages + 2) {
      // Near the start: show 1, 2, 3, 4, 5, ..., last
      for (let i = 2; i <= maxVisible - 2; i++) {
        pages.push(i);
      }
      pages.push(-1); // Ellipsis
      pages.push(total);
    } else if (current >= total - sidePages - 1) {
      // Near the end: show 1, ..., n-4, n-3, n-2, n-1, n
      pages.push(-1); // Ellipsis
      for (let i = total - (maxVisible - 3); i <= total; i++) {
        pages.push(i);
      }
    } else {
      // In the middle: show 1, ..., current-1, current, current+1, ..., last
      pages.push(-1); // Left ellipsis
      for (let i = current - sidePages; i <= current + sidePages; i++) {
        if (i > 1 && i < total) {
          pages.push(i);
        }
      }
      pages.push(-1); // Right ellipsis
      pages.push(total);
    }

    return pages;
  });

  // Input setters for @Input binding
  @Input()
  set currentPageInput(value: number) {
    this.currentPage.set(value);
  }

  @Input()
  set totalItemsInput(value: number) {
    this.totalItems.set(value);
  }

  @Input()
  set pageSizeInput(value: number) {
    this.pageSize.set(value);
  }

  @Input()
  set sizeInput(value: PaginationSize) {
    this.size.set(value);
  }

  @Input()
  set maxVisiblePagesInput(value: number) {
    this.maxVisiblePages.set(value);
  }

  @Input()
  set ariaLabelInput(value: string) {
    this.ariaLabel.set(value);
  }

  @Input()
  set showInfoInput(value: boolean) {
    this.showInfo.set(value);
  }

  // Navigation methods
  goToPreviousPage(): void {
    if (!this.isFirstPage()) {
      const newPage = this.currentPage() - 1;
      this.pageChange.emit(newPage);
    }
  }

  goToNextPage(): void {
    if (!this.isLastPage()) {
      const newPage = this.currentPage() + 1;
      this.pageChange.emit(newPage);
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages() && page !== this.currentPage()) {
      this.pageChange.emit(page);
    }
  }

  // Helper methods
  isCurrentPage(page: number): boolean {
    return page === this.currentPage();
  }

  isEllipsis(page: number): boolean {
    return page === -1;
  }

  shouldRender(): boolean {
    const total = this.totalPages();
    return total > 1;
  }
}

import { Component, signal } from '@angular/core';
import { PaginationComponent, TableComponent, TableColumn } from '@life-cockpit/angular-ui-kit';

@Component({
  selector: 'app-pagination-demo',
  imports: [PaginationComponent, TableComponent],
  templateUrl: './pagination-demo.component.html',
  styleUrls: ['./pagination-demo.component.scss'],
})
export class PaginationDemoComponent {
  // Basic pagination state
  currentPage1 = signal(1);
  totalItems1 = 250;
  pageSize1 = 10;

  // Size variants
  currentPage2 = signal(3);
  totalItems2 = 100;
  pageSize2 = 10;

  currentPage3 = signal(5);
  totalItems3 = 150;
  pageSize3 = 10;

  currentPage4 = signal(8);
  totalItems4 = 200;
  pageSize4 = 10;

  // Page sizes demo
  currentPage5 = signal(1);
  totalItems5 = 500;
  pageSize5 = signal(10);
  availablePageSizes = [10, 25, 50, 100];

  // Many pages demo
  currentPage6 = signal(42);
  totalItems6 = 1000;
  pageSize6 = 10;

  // With info text
  currentPage7 = signal(3);
  totalItems7 = 235;
  pageSize7 = 20;

  // Interactive demo
  currentPageInteractive = signal(1);
  totalItemsInteractive = signal(500);
  pageSizeInteractive = signal(25);

  // Helper for template

  // API Documentation
  apiColumns = signal<TableColumn[]>([
    { key: 'prop', label: 'Property', sortable: false },
    { key: 'type', label: 'Type', sortable: false },
    { key: 'default', label: 'Default', sortable: false },
    { key: 'description', label: 'Description', sortable: false },
  ]);

  apiData = signal([
    {
      prop: 'currentPageInput',
      type: 'number',
      default: '1',
      description: 'Current active page number',
    },
    {
      prop: 'totalItemsInput',
      type: 'number',
      default: '0',
      description: 'Total number of items across all pages',
    },
    {
      prop: 'pageSizeInput',
      type: 'number',
      default: '10',
      description: 'Number of items per page',
    },
    {
      prop: 'sizeInput',
      type: "'sm' | 'md' | 'lg'",
      default: "'md'",
      description: 'Visual size variant',
    },
    {
      prop: 'maxVisiblePagesInput',
      type: 'number',
      default: '7',
      description: 'Maximum number of page buttons to show (ellipsis used beyond this)',
    },
    {
      prop: 'showInfoInput',
      type: 'boolean',
      default: 'false',
      description: 'Show "Showing X to Y of Z items" text',
    },
    {
      prop: 'ariaLabelInput',
      type: 'string',
      default: "'Pagination'",
      description: 'ARIA label for navigation element',
    },
    {
      prop: 'pageChange',
      type: 'EventEmitter<number>',
      default: '-',
      description: 'Event emitted when page changes, emits new page number',
    },
  ]);
  get totalPages5(): number {
    return Math.ceil(this.totalItems5 / this.pageSize5());
  }

  // Event handlers
  onPageChange1(page: number): void {
    this.currentPage1.set(page);
    console.log('Page changed to:', page);
  }

  onPageChange2(page: number): void {
    this.currentPage2.set(page);
  }

  onPageChange3(page: number): void {
    this.currentPage3.set(page);
  }

  onPageChange4(page: number): void {
    this.currentPage4.set(page);
  }

  onPageChange5(page: number): void {
    this.currentPage5.set(page);
  }

  onPageChange6(page: number): void {
    this.currentPage6.set(page);
  }

  onPageChange7(page: number): void {
    this.currentPage7.set(page);
  }

  onPageChangeInteractive(page: number): void {
    this.currentPageInteractive.set(page);
  }

  onPageSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newSize = parseInt(select.value, 10);
    this.pageSize5.set(newSize);
    this.currentPage5.set(1); // Reset to first page when changing page size
  }

  onPageSizeChangeInteractive(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newSize = parseInt(select.value, 10);
    this.pageSizeInteractive.set(newSize);
    this.currentPageInteractive.set(1);
  }
}

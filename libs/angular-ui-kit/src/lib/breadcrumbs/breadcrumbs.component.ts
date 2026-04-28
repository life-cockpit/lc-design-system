import { Component, Input, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  url?: string;
}

export type BreadcrumbSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'lc-breadcrumbs',
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsComponent {
  // Signals for reactive state
  items = signal<BreadcrumbItem[]>([]);
  separator = signal<string>('/');
  maxItems = signal<number>(0); // 0 = show all
  size = signal<BreadcrumbSize>('md');
  ariaLabel = signal<string>('Breadcrumbs');

  // Computed CSS classes
  breadcrumbClasses = computed(() => {
    const classes = ['lc-breadcrumbs'];
    classes.push(`lc-breadcrumbs--${this.size()}`);
    return classes.join(' ');
  });

  // Computed visible items with ellipsis support
  visibleItems = computed(() => {
    const allItems = this.items();
    const max = this.maxItems();

    // If maxItems is 0 or items fit, show all
    if (max === 0 || allItems.length <= max) {
      return allItems;
    }

    // Show first item + ellipsis + last item(s)
    const result: BreadcrumbItem[] = [];
    const lastIndex = allItems.length - 1;

    // Always show first item
    result.push(allItems[0]!);

    // Add ellipsis
    result.push({ label: '...' });

    // Always show last item
    result.push(allItems[lastIndex]!);

    return result;
  });

  // Input setters for @Input binding
  @Input()
  set itemsInput(value: BreadcrumbItem[]) {
    this.items.set(value);
  }

  @Input()
  set separatorInput(value: string) {
    this.separator.set(value);
  }

  @Input()
  set maxItemsInput(value: number) {
    this.maxItems.set(value);
  }

  @Input()
  set sizeInput(value: BreadcrumbSize) {
    this.size.set(value);
  }

  @Input()
  set ariaLabelInput(value: string) {
    this.ariaLabel.set(value);
  }

  // Helper to check if item is last
  isLastItem(index: number): boolean {
    return index === this.visibleItems().length - 1;
  }

  // Helper to check if item is ellipsis
  isEllipsis(item: BreadcrumbItem): boolean {
    return item.label === '...';
  }
}

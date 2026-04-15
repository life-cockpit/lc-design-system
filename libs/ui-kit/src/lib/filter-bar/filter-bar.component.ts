import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
  ContentChildren,
  QueryList,
  AfterContentInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Configuration for a single filter in the FilterBar.
 */
export interface FilterConfig {
  /** Unique key for this filter */
  readonly key: string;
  /** Display label */
  readonly label: string;
  /** Filter type */
  readonly type: 'select' | 'toggle' | 'search';
  /** Available options for select/toggle types */
  readonly options?: readonly FilterOption[];
  /** Placeholder text (for search type) */
  readonly placeholder?: string;
}

export interface FilterOption {
  readonly value: string;
  readonly label: string;
  readonly disabled?: boolean;
}

export interface FilterValues {
  [key: string]: string;
}

/**
 * FilterBar Component
 *
 * Composable filter bar that combines selects, toggle groups, and search
 * in a responsive horizontal layout. Ideal for list pages.
 *
 * @example
 * ```html
 * <lc-filter-bar
 *   [filters]="filterConfig"
 *   [values]="currentFilters"
 *   (valuesChange)="onFilterChange($event)"
 * ></lc-filter-bar>
 * ```
 */
@Component({
  selector: 'lc-filter-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterBarComponent {
  /** Filter configurations */
  filters = input.required<readonly FilterConfig[]>();

  /** Current filter values (two-way bindable) */
  values = input<FilterValues>({});

  /** Size variant */
  size = input<'sm' | 'md'>('md');

  /** Emitted when any filter value changes */
  valuesChange = output<FilterValues>();

  /** Computed size class */
  sizeClass = computed(() => `lc-filter-bar--${this.size()}`);

  /** Get the current value for a filter key */
  getValue(key: string): string {
    return this.values()[key] ?? '';
  }

  /** Handle select / toggle change */
  onFilterChange(key: string, value: string): void {
    const updated = { ...this.values(), [key]: value };
    this.valuesChange.emit(updated);
  }

  /** Handle search input */
  onSearchInput(key: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    this.onFilterChange(key, target.value);
  }

  /** Check if a toggle option is active */
  isToggleActive(key: string, optionValue: string): boolean {
    return this.getValue(key) === optionValue;
  }

  /** Get toggle button classes */
  getToggleClasses(key: string, option: FilterOption): string {
    const classes = ['lc-filter-bar__toggle-btn'];
    if (this.isToggleActive(key, option.value)) {
      classes.push('lc-filter-bar__toggle-btn--active');
    }
    if (option.disabled) {
      classes.push('lc-filter-bar__toggle-btn--disabled');
    }
    return classes.join(' ');
  }
}

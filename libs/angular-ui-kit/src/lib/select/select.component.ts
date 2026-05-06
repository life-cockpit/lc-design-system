import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  ChangeDetectionStrategy,
  forwardRef,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectOptionGroup {
  label: string;
  options: SelectOption[];
}

export type SelectValue = string | number | string[] | number[] | null;

/**
 * Select component for dropdown option selection.
 *
 * Features:
 * - Single and multiple selection modes
 * - Searchable/filterable option list
 * - Option groups with headers
 * - Loading state indicator
 * - Variant styles (outline, filled)
 * - Size presets (xs, sm, md, lg)
 * - Keyboard navigation support
 * - CDK overlay positioning
 * - ControlValueAccessor integration for reactive forms
 *
 * @example
 * ```html
 * <lc-select [options]="options" placeholder="Choose" [(ngModel)]="selected" />
 * ```
 */
/* eslint-disable @typescript-eslint/member-ordering */
@Component({
  selector: 'lc-select',
  standalone: true,
  imports: [CommonModule, FormsModule, OverlayModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor {
  @ViewChild('selectTrigger', { static: false, read: ElementRef })
  selectTrigger!: ElementRef;

  /**
   * Visual variant of the select
   */
  @Input() variant: 'outline' | 'filled' = 'outline';

  /**
   * Size of the select
   */
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' = 'md';

  /**
   * Whether the select is disabled
   */
  @Input() disabled = false;

  /**
   * Whether the select is in error state
   */
  @Input() error = false;

  /**
   * Whether the select is required
   */
  @Input() required = false;

  /**
   * Whether the select is in loading state
   */
  @Input() loading = false;

  /**
   * Whether the select allows searching
   */
  @Input() searchable = false;

  /**
   * Whether multiple options can be selected
   */
  @Input() multiple = false;

  /**
   * Placeholder text when no option is selected
   */
  @Input() placeholder = 'Select an option';

  /**
   * Helper text displayed below the select
   */
  @Input() helperText = '';

  /**
   * Error message displayed when error is true
   */
  @Input() errorMessage = '';

  /**
   * ARIA label for accessibility
   */
  @Input() ariaLabel: string | undefined = undefined;

  /**
   * Select options (flat list)
   */
  @Input()
  get options(): SelectOption[] | SelectOptionGroup[] {
    return this._options();
  }
  set options(v: SelectOption[] | SelectOptionGroup[]) {
    this._options.set(v);
  }
  private _options = signal<SelectOption[] | SelectOptionGroup[]>([]);

  /**
   * Emitted when selection changes
   */
  @Output() readonly selectionChange = new EventEmitter<SelectValue>();

  /**
   * Emitted when dropdown opens
   */
  @Output() readonly opened = new EventEmitter<void>();

  /**
   * Emitted when dropdown closes
   */
  @Output() readonly closed = new EventEmitter<void>();

  // Internal state
  value = signal<SelectValue>(null);
  isOpen = signal<boolean>(false);
  searchQuery = signal<string>('');
  highlightedIndex = signal<number>(-1);

  // Computed values
  selectedLabel = computed(() => {
    const currentValue = this.value();
    const opts = this._options();

    if (currentValue === null) {
      return '';
    }

    if (this.multiple) {
      const values = Array.isArray(currentValue) ? currentValue : [currentValue];
      return values
        .map((val) => this.findOptionByValue(val, opts)?.label)
        .filter(Boolean)
        .join(', ');
    }

    const val = Array.isArray(currentValue) ? currentValue[0] : currentValue;
    return this.findOptionByValue(val ?? '', opts)?.label || '';
  });

  displayValue = computed(() => {
    const label = this.selectedLabel();
    if (label) {
      if (this.multiple && Array.isArray(this.value())) {
        const count = (this.value() as (string | number)[]).length;
        return count > 1 ? `${count} selected` : label;
      }
      return label;
    }
    return this.placeholder;
  });

  filteredOptions = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const opts = this._options();

    if (!query || !this.searchable) {
      return this.flattenOptions(opts);
    }

    return this.flattenOptions(opts).filter((opt) => opt.label.toLowerCase().includes(query));
  });

  // Private properties
  private elementRef = inject(ElementRef);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  private onChange: (value: SelectValue) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/member-ordering
  private onTouched: () => void = () => {};

  // Public methods
  /**
   * Toggle dropdown open/closed
   */
  toggle(): void {
    if (this.disabled || this.loading) {
      return;
    }
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Open dropdown
   */
  open(): void {
    if (this.disabled || this.loading) {
      return;
    }
    this.isOpen.set(true);
    this.opened.emit();
  }

  /**
   * Close dropdown
   */
  close(): void {
    this.isOpen.set(false);
    this.searchQuery.set('');
    this.highlightedIndex.set(-1);
    this.closed.emit();
  }

  /**
   * Select an option
   */
  selectOption(option: SelectOption): void {
    if (option.disabled) {
      return;
    }

    if (this.multiple) {
      const currentValue = this.value() || [];
      const currentArray = (Array.isArray(currentValue) ? currentValue : []) as (string | number)[];
      const index = currentArray.indexOf(option.value);

      if (index > -1) {
        // Deselect
        const newValue = currentArray.filter((v) => v !== option.value);
        this.value.set(newValue as SelectValue);
        this.onChange(newValue as SelectValue);
      } else {
        // Select
        const newValue = [...currentArray, option.value];
        this.value.set(newValue as SelectValue);
        this.onChange(newValue as SelectValue);
      }
      this.selectionChange.emit(this.value());
    } else {
      this.value.set(option.value);
      this.onChange(option.value);
      this.selectionChange.emit(option.value);
      this.close();
    }
  }

  /**
   * Check if an option is selected
   */
  isSelected(option: SelectOption): boolean {
    const currentValue = this.value();
    if (this.multiple) {
      const values = Array.isArray(currentValue) ? currentValue : [];
      return values.some((v) => v === option.value);
    }
    return currentValue === option.value;
  }

  /**
   * Clear selection
   */
  clear(): void {
    if (this.multiple) {
      this.value.set([]);
      this.onChange([]);
    } else {
      this.value.set(null);
      this.onChange(null);
    }
    this.selectionChange.emit(this.value());
  }

  /**
   * Handle keyboard navigation
   */
  onKeyDown(event: KeyboardEvent): void {
    if (this.disabled || this.loading) {
      return;
    }

    switch (event.key) {
      case 'Enter':
      case ' ':
        if (!this.isOpen()) {
          this.open();
          event.preventDefault();
        } else if (this.highlightedIndex() >= 0) {
          const options = this.filteredOptions();
          const option = options[this.highlightedIndex()];
          if (option) {
            this.selectOption(option);
          }
          event.preventDefault();
        }
        break;

      case 'Escape':
        if (this.isOpen()) {
          this.close();
          event.preventDefault();
        }
        break;

      case 'ArrowDown':
        if (!this.isOpen()) {
          this.open();
        } else {
          const options = this.filteredOptions();
          const nextIndex = (this.highlightedIndex() + 1) % options.length;
          this.highlightedIndex.set(nextIndex);
        }
        event.preventDefault();
        break;

      case 'ArrowUp':
        if (!this.isOpen()) {
          this.open();
        } else {
          const options = this.filteredOptions();
          const prevIndex =
            this.highlightedIndex() <= 0 ? options.length - 1 : this.highlightedIndex() - 1;
          this.highlightedIndex.set(prevIndex);
        }
        event.preventDefault();
        break;
    }
  }

  /**
   * Handle blur event
   */
  onBlur(): void {
    this.onTouched();
  }

  /**
   * Handle click outside
   */
  onClickOutside(): void {
    if (this.isOpen()) {
      this.close();
    }
  }

  // ControlValueAccessor implementation
  writeValue(value: SelectValue): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: SelectValue) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Get computed classes for the select element
   */
  get selectClasses(): string {
    const classes = ['lc-select'];

    classes.push(`lc-select--${this.variant}`);
    classes.push(`lc-select--${this.size}`);

    if (this.disabled) {
      classes.push('lc-select--disabled');
    }

    if (this.error) {
      classes.push('lc-select--error');
    }

    if (this.loading) {
      classes.push('lc-select--loading');
    }

    if (this.isOpen()) {
      classes.push('lc-select--open');
    }

    return classes.join(' ');
  }

  // Private helper methods
  private findOptionByValue(
    value: string | number,
    options: SelectOption[] | SelectOptionGroup[],
  ): SelectOption | undefined {
    const flatOptions = this.flattenOptions(options);
    return flatOptions.find((opt) => opt.value === value);
  }

  private flattenOptions(options: SelectOption[] | SelectOptionGroup[]): SelectOption[] {
    if (!options || options.length === 0) {
      return [];
    }

    // Check if first item is a group
    const firstItem = options[0];
    if (firstItem && 'options' in firstItem) {
      return (options as SelectOptionGroup[]).flatMap((group) => group.options);
    }

    return options as SelectOption[];
  }
}

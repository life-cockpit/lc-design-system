import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  computed,
  effect,
  forwardRef,
  ElementRef,
  ViewChild,
  HostListener,
  inject,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, Subject, Subscription, debounceTime, switchMap, of } from 'rxjs';
import { IconComponent } from '../icon/icon.component';
import { SpinnerComponent } from '../spinner/spinner.component';
import { ChipComponent } from '../chip/chip.component';

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
  icon?: string;
  group?: string;
  disabled?: boolean;
}

export type ComboboxValue = ComboboxOption | ComboboxOption[] | null;

export type ComboboxSize = 'xs' | 'sm' | 'md' | 'lg';

/**
 * Combobox / async autocomplete component.
 *
 * Supports free-text input with sync/async option suggestions,
 * single/multiple selection, create new entries, and keyboard navigation.
 *
 * @example
 * ```html
 * <lc-combobox
 *   label="Assign to user"
 *   [loadOptions]="searchUsers"
 *   [(value)]="assignee"
 *   allowCreate
 * />
 * ```
 */
@Component({
  selector: 'lc-combobox',
  standalone: true,
  imports: [CommonModule, IconComponent, SpinnerComponent, ChipComponent],
  templateUrl: './combobox.component.html',
  styleUrls: ['./combobox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ComboboxComponent),
      multi: true,
    },
  ],
})
export class ComboboxComponent implements ControlValueAccessor, OnDestroy {
  @ViewChild('inputEl') inputEl?: ElementRef<HTMLInputElement>;

  private readonly elRef = inject(ElementRef);
  private querySubject = new Subject<string>();
  private asyncSub?: Subscription;

  /** Sync options */
  readonly options = input<ComboboxOption[]>([]);

  /** Async option loader */
  readonly loadOptions = input<((query: string) => Observable<ComboboxOption[]>)>();

  /** Debounce for async queries */
  readonly debounceMs = input<number>(250);

  /** Minimum characters before triggering search */
  readonly minChars = input<number>(1);

  /** Placeholder text */
  readonly placeholder = input<string>('Search…');

  /** Label */
  readonly label = input<string>();

  /** Helper text */
  readonly helperText = input<string>();

  /** Error message */
  readonly error = input<string>();

  /** Disabled state */
  readonly disabled = input<boolean>(false);

  /** Allow multiple selections */
  readonly multiple = input<boolean>(false);

  /** Allow creating new entries */
  readonly allowCreate = input<boolean>(false);

  /** Show loading spinner (controlled) */
  readonly loading = input<boolean>(false);

  /** Empty state message */
  readonly emptyMessage = input<string>('No results');

  /** Size */
  readonly size = input<ComboboxSize>('md');

  /** Value change event */
  readonly valueChange = output<ComboboxValue>();

  /** Query change event */
  readonly queryChange = output<string>();

  /** Option selected event */
  readonly optionSelected = output<ComboboxOption>();

  /** Created event (allowCreate) */
  readonly created = output<string>();

  /** Internal state */
  protected query = signal('');
  protected isOpen = signal(false);
  protected highlightedIndex = signal(-1);
  protected asyncOptions = signal<ComboboxOption[]>([]);
  protected isLoading = signal(false);

  /** Selected values */
  protected selectedSingle = signal<ComboboxOption | null>(null);
  protected selectedMultiple = signal<ComboboxOption[]>([]);

  /** Resolved visible options */
  protected visibleOptions = computed(() => {
    const q = this.query().toLowerCase();
    const loader = this.loadOptions();

    let opts: ComboboxOption[];
    if (loader) {
      opts = this.asyncOptions();
    } else {
      opts = this.options();
      if (q.length >= this.minChars()) {
        opts = opts.filter(
          (o) =>
            o.label.toLowerCase().includes(q) ||
            o.value.toLowerCase().includes(q) ||
            (o.description && o.description.toLowerCase().includes(q))
        );
      }
    }

    // Remove already selected in multiple mode
    if (this.multiple()) {
      const selected = new Set(this.selectedMultiple().map((s) => s.value));
      opts = opts.filter((o) => !selected.has(o.value));
    }

    return opts;
  });

  /** Grouped options */
  protected groupedOptions = computed(() => {
    const opts = this.visibleOptions();
    const groups = new Map<string, ComboboxOption[]>();

    for (const opt of opts) {
      const group = opt.group || '';
      if (!groups.has(group)) groups.set(group, []);
      groups.get(group)!.push(opt);
    }

    return Array.from(groups.entries()).map(([label, items]) => ({
      label,
      items,
    }));
  });

  /** Flat list for keyboard nav */
  protected flatOptions = computed(() => {
    return this.groupedOptions().flatMap((g) => g.items);
  });

  /** Whether to show "Create" option */
  protected showCreateOption = computed(() => {
    if (!this.allowCreate()) return false;
    const q = this.query().trim();
    if (!q) return false;
    const exact = this.visibleOptions().some(
      (o) => o.label.toLowerCase() === q.toLowerCase()
    );
    return !exact;
  });

  /** Container classes */
  protected containerClasses = computed(() => {
    const classes = [`lc-combobox`, `lc-combobox--${this.size()}`];
    if (this.disabled()) classes.push('lc-combobox--disabled');
    if (this.error()) classes.push('lc-combobox--error');
    if (this.isOpen()) classes.push('lc-combobox--open');
    return classes.join(' ');
  });

  // ControlValueAccessor
  private onChange: (value: ComboboxValue) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    // Async loading pipe
    this.asyncSub = this.querySubject
      .pipe(
        debounceTime(this.debounceMs()),
        switchMap((q) => {
          const loader = this.loadOptions();
          if (!loader || q.length < this.minChars()) {
            return of([]);
          }
          this.isLoading.set(true);
          return loader(q);
        })
      )
      .subscribe((results) => {
        this.asyncOptions.set(results);
        this.isLoading.set(false);
      });
  }

  ngOnDestroy(): void {
    this.asyncSub?.unsubscribe();
    this.querySubject.complete();
  }

  writeValue(value: ComboboxValue): void {
    if (this.multiple()) {
      this.selectedMultiple.set(Array.isArray(value) ? value : []);
    } else {
      this.selectedSingle.set(
        value && !Array.isArray(value) ? value : null
      );
      if (value && !Array.isArray(value)) {
        this.query.set(value.label);
      }
    }
  }

  registerOnChange(fn: (value: ComboboxValue) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // handled by input
  }

  protected onInputChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.query.set(value);
    this.queryChange.emit(value);
    this.highlightedIndex.set(-1);

    if (this.loadOptions()) {
      this.querySubject.next(value);
    }

    if (value.length >= this.minChars()) {
      this.isOpen.set(true);
    }
  }

  protected onInputFocus(): void {
    if (this.query().length >= this.minChars() || this.options().length > 0) {
      this.isOpen.set(true);
    }
  }

  protected onInputBlur(): void {
    this.onTouched();
    // Delay to allow click on dropdown
    setTimeout(() => this.isOpen.set(false), 200);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const flat = this.flatOptions();
    const total = flat.length + (this.showCreateOption() ? 1 : 0);

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.isOpen.set(true);
        this.highlightedIndex.update((i) => (i + 1) % total);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.highlightedIndex.update((i) => (i - 1 + total) % total);
        break;
      case 'Enter':
        event.preventDefault();
        if (this.highlightedIndex() >= 0) {
          if (this.highlightedIndex() === flat.length && this.showCreateOption()) {
            this.onCreateNew();
          } else {
            const opt = flat[this.highlightedIndex()];
            if (opt && !opt.disabled) {
              this.selectOption(opt);
            }
          }
        } else if (this.showCreateOption()) {
          this.onCreateNew();
        }
        break;
      case 'Escape':
        this.isOpen.set(false);
        break;
      case 'Tab':
        if (this.highlightedIndex() >= 0 && this.isOpen()) {
          const opt = flat[this.highlightedIndex()];
          if (opt && !opt.disabled) {
            this.selectOption(opt);
          }
        }
        this.isOpen.set(false);
        break;
      case 'Backspace':
        if (this.multiple() && !this.query() && this.selectedMultiple().length > 0) {
          this.removeSelected(this.selectedMultiple()[this.selectedMultiple().length - 1]);
        }
        break;
    }
  }

  protected selectOption(option: ComboboxOption): void {
    if (this.multiple()) {
      this.selectedMultiple.update((sel) => [...sel, option]);
      this.query.set('');
      const value = this.selectedMultiple();
      this.onChange(value);
      this.valueChange.emit(value);
    } else {
      this.selectedSingle.set(option);
      this.query.set(option.label);
      this.onChange(option);
      this.valueChange.emit(option);
    }
    this.optionSelected.emit(option);
    this.isOpen.set(false);
    this.highlightedIndex.set(-1);
  }

  protected removeSelected(option: ComboboxOption): void {
    this.selectedMultiple.update((sel) =>
      sel.filter((s) => s.value !== option.value)
    );
    const value = this.selectedMultiple();
    this.onChange(value);
    this.valueChange.emit(value);
    this.inputEl?.nativeElement.focus();
  }

  protected onCreateNew(): void {
    const q = this.query().trim();
    if (!q) return;
    const newOption: ComboboxOption = { value: q, label: q };
    this.created.emit(q);
    this.selectOption(newOption);
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}

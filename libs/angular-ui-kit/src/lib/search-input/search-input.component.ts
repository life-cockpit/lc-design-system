import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
  computed,
  ElementRef,
  viewChild,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

export type SearchInputSize = 'sm' | 'md' | 'lg';

/**
 * Search input with built-in icon, clear button, and optional debounce.
 *
 * @example
 * ```html
 * <lc-search-input
 *   placeholder="Search..."
 *   [debounceMs]="300"
 *   (searchChange)="onSearch($event)"
 * ></lc-search-input>
 * ```
 */
@Component({
  selector: 'lc-search-input',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInputComponent implements OnInit, OnDestroy {
  /**
   * Placeholder text.
   * @default 'Search…'
   */
  placeholder = input<string>('Search…');

  /**
   * Size variant.
   * @default 'md'
   */
  size = input<SearchInputSize>('md');

  /**
   * Debounce delay in milliseconds. 0 means no debounce.
   * @default 300
   */
  debounceMs = input<number>(300);

  /**
   * Whether the search input is disabled.
   * @default false
   */
  disabled = input<boolean>(false);

  /**
   * Emitted when the search value changes (debounced).
   */
  readonly searchChange = output<string>();

  /**
   * Emitted when the user presses Enter.
   */
  readonly searchSubmit = output<string>();

  protected value = signal('');
  protected readonly inputRef = viewChild<ElementRef<HTMLInputElement>>('searchInputEl');

  protected wrapperClasses = computed(() => {
    return [
      'search-input',
      `search-input--${this.size()}`,
      this.disabled() ? 'search-input--disabled' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  private readonly input$ = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.input$
      .pipe(
        debounceTime(this.debounceMs()),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
      )
      .subscribe((value) => this.searchChange.emit(value));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.input$.next(val);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.searchSubmit.emit(this.value());
    }
  }

  protected clear(): void {
    this.value.set('');
    this.input$.next('');
    this.searchChange.emit('');
    this.inputRef()?.nativeElement.focus();
  }
}

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

export type DateValue = Date | string | null;

/**
 * Datepicker component for date selection with calendar overlay.
 *
 * Features:
 * - Calendar popup with month and year navigation
 * - Min/max date constraints
 * - Disabled specific dates and weekends
 * - Configurable date format string
 * - Variant styles (outline, filled)
 * - Size presets (xs, sm, md, lg)
 * - Disabled and readonly states
 * - ControlValueAccessor integration for reactive forms
 *
 * @example
 * ```html
 * <lc-datepicker placeholder="Select date" [(ngModel)]="selectedDate" />
 * ```
 */
/* eslint-disable @typescript-eslint/member-ordering */
@Component({
  selector: 'lc-datepicker',
  standalone: true,
  imports: [CommonModule, FormsModule, OverlayModule],
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true,
    },
  ],
})
export class DatepickerComponent implements ControlValueAccessor {
  @ViewChild('datepickerInput', { static: false, read: ElementRef })
  datepickerInput!: ElementRef;

  /**
   * Visual variant of the datepicker
   */
  @Input() variant: 'outline' | 'filled' = 'outline';

  /**
   * Size of the datepicker
   */
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' = 'md';

  /**
   * Whether the datepicker is disabled
   */
  @Input() disabled = false;

  /**
   * Whether the datepicker is in error state
   */
  @Input() error = false;

  /**
   * Whether the datepicker is required
   */
  @Input() required = false;

  /**
   * Whether the datepicker is readonly
   */
  @Input() readonly = false;

  /**
   * Placeholder text
   */
  @Input() placeholder = 'Select a date';

  /**
   * Helper text displayed below the datepicker
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
   * Date format string (e.g., 'YYYY-MM-DD', 'MM/DD/YYYY')
   */
  @Input() format = 'YYYY-MM-DD';

  /**
   * Minimum selectable date
   */
  @Input() minDate: Date | undefined = undefined;

  /**
   * Maximum selectable date
   */
  @Input() maxDate: Date | undefined = undefined;

  /**
   * Array of disabled dates
   */
  @Input() disabledDates: Date[] = [];

  /**
   * Whether to disable weekends
   */
  @Input() disableWeekends = false;

  /**
   * Emitted when date selection changes
   */
  @Output() readonly dateChange = new EventEmitter<Date | null>();

  /**
   * Emitted when calendar opens
   */
  @Output() readonly opened = new EventEmitter<void>();

  /**
   * Emitted when calendar closes
   */
  @Output() readonly closed = new EventEmitter<void>();

  // Internal state
  selectedDate = signal<Date | null>(null);
  isOpen = signal<boolean>(false);
  currentMonth = signal<number>(new Date().getMonth());
  currentYear = signal<number>(new Date().getFullYear());
  inputValue = signal<string>('');

  // Computed values
  formattedDate = computed(() => {
    const date = this.selectedDate();
    if (!date) return '';
    return this.formatDate(date, this.format);
  });

  weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  currentMonthName = computed(() => {
    return this.monthNames[this.currentMonth()];
  });

  // Private properties
  private elementRef = inject(ElementRef);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  private onChange: (value: Date | null) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/member-ordering
  private onTouched: () => void = () => {};

  // Public methods
  /**
   * Toggle calendar open/closed
   */
  toggle(): void {
    if (this.disabled || this.readonly) {
      return;
    }
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Open calendar
   */
  open(): void {
    if (this.disabled || this.readonly) {
      return;
    }
    this.isOpen.set(true);

    // Set calendar to selected date's month/year or current
    if (this.selectedDate()) {
      const date = this.selectedDate()!;
      this.currentMonth.set(date.getMonth());
      this.currentYear.set(date.getFullYear());
    }

    this.opened.emit();
  }

  /**
   * Close calendar
   */
  close(): void {
    this.isOpen.set(false);
    this.closed.emit();
  }

  /**
   * Select a date
   */
  selectDate(date: Date): void {
    if (this.disabled || this.readonly || this.isDateDisabled(date)) {
      return;
    }

    this.selectedDate.set(date);
    this.inputValue.set(this.formatDate(date, this.format));
    this.onChange(date);
    this.dateChange.emit(date);
    this.close();
  }

  /**
   * Clear selected date
   */
  clear(): void {
    this.selectedDate.set(null);
    this.inputValue.set('');
    this.onChange(null);
    this.dateChange.emit(null);
  }

  /**
   * Check if a date is disabled
   */
  isDateDisabled(date: Date): boolean {
    // Check min date
    if (this.minDate && date < this.minDate) {
      return true;
    }

    // Check max date
    if (this.maxDate && date > this.maxDate) {
      return true;
    }

    // Check disabled dates
    if (this.disabledDates.some((d) => this.isSameDate(d, date))) {
      return true;
    }

    // Check weekends
    if (this.disableWeekends) {
      const day = date.getDay();
      if (day === 0 || day === 6) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if date is today
   */
  isToday(date: Date): boolean {
    const today = new Date();
    return this.isSameDate(date, today);
  }

  /**
   * Check if date is selected
   */
  isSelectedDate(date: Date): boolean {
    const selected = this.selectedDate();
    return selected ? this.isSameDate(date, selected) : false;
  }

  /**
   * Generate calendar days for current month
   */
  generateCalendarDays(): Date[] {
    const year = this.currentYear();
    const month = this.currentMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days: Date[] = [];

    // Add previous month's days
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push(date);
    }

    // Add current month's days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    // Add next month's days to complete the grid
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }

    return days.slice(0, 42); // Ensure exactly 42 days (6 weeks)
  }

  /**
   * Navigate to next month
   */
  nextMonth(): void {
    if (this.currentMonth() === 11) {
      this.currentMonth.set(0);
      this.currentYear.set(this.currentYear() + 1);
    } else {
      this.currentMonth.set(this.currentMonth() + 1);
    }
  }

  /**
   * Navigate to previous month
   */
  previousMonth(): void {
    if (this.currentMonth() === 0) {
      this.currentMonth.set(11);
      this.currentYear.set(this.currentYear() - 1);
    } else {
      this.currentMonth.set(this.currentMonth() - 1);
    }
  }

  /**
   * Navigate to today
   */
  goToToday(): void {
    const today = new Date();
    this.currentMonth.set(today.getMonth());
    this.currentYear.set(today.getFullYear());
  }

  /**
   * Handle input change (manual date entry)
   */
  onInputChange(value: string): void {
    this.inputValue.set(value);

    try {
      const date = this.parseDate(value, this.format);
      if (date && !isNaN(date.getTime()) && !this.isDateDisabled(date)) {
        this.selectedDate.set(date);
        this.onChange(date);
        this.dateChange.emit(date);
      }
    } catch {
      // Invalid date format, ignore
    }
  }

  /**
   * Handle keyboard navigation
   */
  onKeyDown(event: KeyboardEvent): void {
    if (this.disabled || this.readonly) {
      return;
    }

    if (
      !this.isOpen() &&
      (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ')
    ) {
      this.open();
      event.preventDefault();
      return;
    }

    if (!this.isOpen()) return;

    const currentDate = this.selectedDate() || new Date();
    let newDate: Date | null = null;

    switch (event.key) {
      case 'Escape':
        this.close();
        event.preventDefault();
        break;

      case 'ArrowRight':
        newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + 1);
        event.preventDefault();
        break;

      case 'ArrowLeft':
        newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() - 1);
        event.preventDefault();
        break;

      case 'ArrowDown':
        newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + 7);
        event.preventDefault();
        break;

      case 'ArrowUp':
        newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() - 7);
        event.preventDefault();
        break;

      case 'Enter':
        if (this.selectedDate()) {
          this.selectDate(this.selectedDate()!);
        }
        event.preventDefault();
        break;
    }

    if (newDate && !this.isDateDisabled(newDate)) {
      this.selectedDate.set(newDate);
      this.currentMonth.set(newDate.getMonth());
      this.currentYear.set(newDate.getFullYear());
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
  writeValue(value: DateValue): void {
    if (value === null || value === undefined) {
      this.selectedDate.set(null);
      this.inputValue.set('');
    } else if (value instanceof Date) {
      this.selectedDate.set(value);
      this.inputValue.set(this.formatDate(value, this.format));
    } else if (typeof value === 'string') {
      try {
        const date = this.parseDate(value, this.format);
        if (date && !isNaN(date.getTime())) {
          this.selectedDate.set(date);
          this.inputValue.set(this.formatDate(date, this.format));
        }
      } catch {
        this.selectedDate.set(null);
        this.inputValue.set('');
      }
    }
  }

  registerOnChange(fn: (value: Date | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Get computed classes for the datepicker element
   */
  get datepickerClasses(): string {
    const classes = ['lc-datepicker'];

    classes.push(`lc-datepicker--${this.variant}`);
    classes.push(`lc-datepicker--${this.size}`);

    if (this.disabled) {
      classes.push('lc-datepicker--disabled');
    }

    if (this.error) {
      classes.push('lc-datepicker--error');
    }

    if (this.readonly) {
      classes.push('lc-datepicker--readonly');
    }

    if (this.isOpen()) {
      classes.push('lc-datepicker--open');
    }

    return classes.join(' ');
  }

  /**
   * Check if date is in current month
   */
  isCurrentMonth(date: Date): boolean {
    return date.getMonth() === this.currentMonth() && date.getFullYear() === this.currentYear();
  }

  // Private helper methods
  /**
   * Check if two dates are the same day
   */
  private isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  private formatDate(date: Date, format: string): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return format.replace('YYYY', String(year)).replace('MM', month).replace('DD', day);
  }

  private parseDate(value: string, format: string): Date {
    const yearIndex = format.indexOf('YYYY');
    const monthIndex = format.indexOf('MM');
    const dayIndex = format.indexOf('DD');

    const year = parseInt(value.substring(yearIndex, yearIndex + 4));
    const month = parseInt(value.substring(monthIndex, monthIndex + 2)) - 1;
    const day = parseInt(value.substring(dayIndex, dayIndex + 2));

    return new Date(year, month, day);
  }

  protected getInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }
}

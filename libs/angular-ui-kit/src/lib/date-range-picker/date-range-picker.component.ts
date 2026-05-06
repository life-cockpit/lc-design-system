import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
  computed,
  output,
  forwardRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

@Component({
  selector: 'lc-date-range-picker',
  standalone: true,
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateRangePickerComponent),
      multi: true,
    },
  ],
})
export class DateRangePickerComponent implements ControlValueAccessor {
  readonly label = input('');
  readonly placeholder = input('Select date range');
  readonly disabled = input(false);
  readonly minDate = input<Date | null>(null);
  readonly maxDate = input<Date | null>(null);

  readonly rangeChange = output<DateRange>();

  protected isOpen = signal(false);
  protected range = signal<DateRange>({ start: null, end: null });
  protected selecting = signal<'start' | 'end'>('start');
  protected hoveredDate = signal<Date | null>(null);
  protected viewingMonth = signal(new Date());

  private onChange: (val: DateRange) => void = () => {};
  private onTouched: () => void = () => {};

  protected readonly displayValue = computed(() => {
    const r = this.range();
    if (!r.start) return '';
    const fmt = (d: Date) => d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    if (!r.end) return fmt(r.start) + ' – …';
    return `${fmt(r.start)} – ${fmt(r.end)}`;
  });

  protected readonly monthLabel = computed(() => {
    const d = this.viewingMonth();
    return d.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
  });

  protected readonly weekdays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  protected readonly calendarDays = computed(() => {
    const viewing = this.viewingMonth();
    const year = viewing.getFullYear();
    const month = viewing.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    let startDow = firstDay.getDay();
    if (startDow === 0) startDow = 7; // Monday = 1
    const prefixDays = startDow - 1;

    const days: { date: Date; inMonth: boolean; disabled: boolean }[] = [];

    for (let i = prefixDays; i > 0; i--) {
      const d = new Date(year, month, 1 - i);
      days.push({ date: d, inMonth: false, disabled: this.isDateDisabled(d) });
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d);
      days.push({ date, inMonth: true, disabled: this.isDateDisabled(date) });
    }

    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      days.push({ date: d, inMonth: false, disabled: this.isDateDisabled(d) });
    }

    return days;
  });

  writeValue(value: DateRange | null): void {
    this.range.set(value ?? { start: null, end: null });
    if (value?.start) {
      this.viewingMonth.set(new Date(value.start.getFullYear(), value.start.getMonth(), 1));
    }
  }

  registerOnChange(fn: (val: DateRange) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }

  protected toggle(): void {
    if (this.disabled()) return;
    this.isOpen.update(v => !v);
    if (this.isOpen()) this.selecting.set('start');
  }

  protected close(): void {
    this.isOpen.set(false);
    this.onTouched();
  }

  protected prevMonth(): void {
    this.viewingMonth.update(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  protected nextMonth(): void {
    this.viewingMonth.update(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  protected selectDate(date: Date): void {
    if (this.isDateDisabled(date)) return;

    const current = this.range();
    if (this.selecting() === 'start') {
      this.range.set({ start: date, end: null });
      this.selecting.set('end');
    } else {
      if (date < current.start!) {
        this.range.set({ start: date, end: current.start });
      } else {
        this.range.set({ start: current.start, end: date });
      }
      this.selecting.set('start');
      this.emitRange();
      this.close();
    }
  }

  protected onDayHover(date: Date): void {
    if (this.selecting() === 'end') {
      this.hoveredDate.set(date);
    }
  }

  protected isStart(date: Date): boolean {
    return this.sameDay(date, this.range().start);
  }

  protected isEnd(date: Date): boolean {
    return this.sameDay(date, this.range().end);
  }

  protected isInRange(date: Date): boolean {
    const r = this.range();
    if (!r.start) return false;
    const end = r.end || this.hoveredDate();
    if (!end) return false;
    const s = Math.min(r.start.getTime(), end.getTime());
    const e = Math.max(r.start.getTime(), end.getTime());
    const t = date.getTime();
    return t > s && t < e;
  }

  protected isToday(date: Date): boolean {
    return this.sameDay(date, new Date());
  }

  protected clearRange(event: Event): void {
    event.stopPropagation();
    this.range.set({ start: null, end: null });
    const r = { start: null, end: null };
    this.onChange(r);
    this.rangeChange.emit(r);
  }

  private isDateDisabled(date: Date): boolean {
    const min = this.minDate();
    const max = this.maxDate();
    if (min && date < min) return true;
    if (max && date > max) return true;
    return false;
  }

  private sameDay(a: Date | null, b: Date | null): boolean {
    if (!a || !b) return false;
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  private emitRange(): void {
    const r = this.range();
    this.onChange(r);
    this.rangeChange.emit(r);
  }
}

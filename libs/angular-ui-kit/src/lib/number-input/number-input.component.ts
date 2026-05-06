import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  computed,
  signal,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'lc-number-input',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberInputComponent),
      multi: true,
    },
  ],
})
export class NumberInputComponent implements ControlValueAccessor {
  /** Minimum value */
  min = input<number | undefined>(undefined);

  /** Maximum value */
  max = input<number | undefined>(undefined);

  /** Step increment */
  step = input<number>(1);

  /** Label text */
  label = input<string>();

  /** Placeholder */
  placeholder = input<string>('0');

  /** Disabled state */
  disabled = input<boolean>(false);

  /** Emits value on change */
  valueChange = output<number>();

  protected value = signal<number | null>(null);
  protected isDisabled = signal(false);

  protected containerClasses = computed(() => {
    const classes = ['number-input'];
    if (this.disabled() || this.isDisabled()) classes.push('number-input--disabled');
    return classes.join(' ');
  });

  protected canDecrement = computed(() => {
    const val = this.value();
    const minV = this.min();
    if (val === null) return true;
    if (minV === undefined) return true;
    return val - this.step() >= minV;
  });

  protected canIncrement = computed(() => {
    const val = this.value();
    const maxV = this.max();
    if (val === null) return true;
    if (maxV === undefined) return true;
    return val + this.step() <= maxV;
  });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (val: number | null) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  decrement(): void {
    const cur = this.value() ?? 0;
    const next = cur - this.step();
    const minV = this.min();
    const clamped = minV !== undefined ? Math.max(minV, next) : next;
    this.setValue(clamped);
  }

  increment(): void {
    const cur = this.value() ?? 0;
    const next = cur + this.step();
    const maxV = this.max();
    const clamped = maxV !== undefined ? Math.min(maxV, next) : next;
    this.setValue(clamped);
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const raw = target.value;
    if (raw === '' || raw === '-') {
      this.value.set(null);
      this.onChange(null);
      return;
    }
    const parsed = Number(raw);
    if (!isNaN(parsed)) {
      this.setValue(parsed);
    }
  }

  onBlur(): void {
    this.onTouched();
    // Clamp on blur
    const val = this.value();
    if (val === null) return;
    const minV = this.min();
    const maxV = this.max();
    let clamped = val;
    if (minV !== undefined) clamped = Math.max(minV, clamped);
    if (maxV !== undefined) clamped = Math.min(maxV, clamped);
    if (clamped !== val) {
      this.setValue(clamped);
    }
  }

  private setValue(val: number): void {
    this.value.set(val);
    this.valueChange.emit(val);
    this.onChange(val);
  }

  // ControlValueAccessor
  writeValue(val: number | null): void {
    this.value.set(val);
  }

  registerOnChange(fn: (val: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }
}

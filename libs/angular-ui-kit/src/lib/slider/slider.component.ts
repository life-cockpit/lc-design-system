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

@Component({
  selector: 'lc-slider',
  standalone: true,
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SliderComponent),
      multi: true,
    },
  ],
})
export class SliderComponent implements ControlValueAccessor {
  /** Minimum value */
  min = input<number>(0);

  /** Maximum value */
  max = input<number>(100);

  /** Step increment */
  step = input<number>(1);

  /** Label text */
  label = input<string>();

  /** Whether to show the current value */
  showValue = input<boolean>(true);

  /** Disabled state */
  disabled = input<boolean>(false);

  /** Emits the current value on change */
  valueChange = output<number>();

  /** Internal value */
  protected value = signal(0);

  /** Internal disabled state — merged from input + CVA */
  protected isDisabled = signal(false);

  /** Percentage for fill track */
  protected fillPercentage = computed(() => {
    const minV = this.min();
    const maxV = this.max();
    if (maxV === minV) return 0;
    return ((this.value() - minV) / (maxV - minV)) * 100;
  });

  protected sliderClasses = computed(() => {
    const classes = ['slider'];
    if (this.disabled() || this.isDisabled()) classes.push('slider--disabled');
    return classes.join(' ');
  });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (val: number) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const val = Number(target.value);
    this.value.set(val);
    this.valueChange.emit(val);
    this.onChange(val);
  }

  onBlur(): void {
    this.onTouched();
  }

  // ControlValueAccessor
  writeValue(val: number): void {
    this.value.set(val ?? 0);
  }

  registerOnChange(fn: (val: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }
}

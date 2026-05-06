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

const DEFAULT_SWATCHES = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
  '#0ea5e9', '#10b981', '#a855f7', '#64748b', '#000000',
  '#ffffff',
];

@Component({
  selector: 'lc-color-picker',
  standalone: true,
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorPickerComponent),
      multi: true,
    },
  ],
})
export class ColorPickerComponent implements ControlValueAccessor {
  /** Label text */
  label = input<string>();

  /** Predefined color swatches */
  swatches = input<string[]>(DEFAULT_SWATCHES);

  /** Whether to show the hex input field */
  showInput = input<boolean>(true);

  /** Whether the picker is disabled */
  disabled = input<boolean>(false);

  /** Emits the selected color hex value */
  colorChange = output<string>();

  protected value = signal('#3b82f6');
  protected isDisabled = signal(false);

  protected pickerClasses = computed(() => {
    const classes = ['color-picker'];
    if (this.disabled() || this.isDisabled()) classes.push('color-picker--disabled');
    return classes.join(' ');
  });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (val: string) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  protected selectSwatch(color: string): void {
    if (this.disabled() || this.isDisabled()) return;
    this.setValue(color);
  }

  protected onNativeInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.setValue(target.value);
  }

  protected onHexInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    let val = target.value.trim();
    if (!val.startsWith('#')) val = '#' + val;
    if (/^#[0-9a-fA-F]{6}$/.test(val)) {
      this.setValue(val);
    }
  }

  protected onBlur(): void {
    this.onTouched();
  }

  private setValue(color: string): void {
    this.value.set(color);
    this.colorChange.emit(color);
    this.onChange(color);
  }

  // ControlValueAccessor
  writeValue(val: string): void {
    this.value.set(val ?? '#3b82f6');
  }

  registerOnChange(fn: (val: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }
}

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

export type RatingSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'lc-rating',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RatingComponent),
      multi: true,
    },
  ],
})
export class RatingComponent implements ControlValueAccessor {
  /** Maximum number of stars */
  max = input<number>(5);

  /** Size variant */
  size = input<RatingSize>('md');

  /** Whether the rating is read-only */
  readonly = input<boolean>(false);

  /** Whether the rating is disabled */
  disabled = input<boolean>(false);

  /** Whether to allow half-star ratings */
  allowHalf = input<boolean>(false);

  /** Label text */
  label = input<string>();

  /** Whether to show the numeric value */
  showValue = input<boolean>(false);

  /** Emits the selected rating */
  ratingChange = output<number>();

  protected value = signal(0);
  protected hoveredValue = signal(0);
  protected isDisabled = signal(false);

  protected stars = computed(() => {
    return Array.from({ length: this.max() }, (_, i) => i + 1);
  });

  protected ratingClasses = computed(() => {
    const classes = ['rating', `rating--${this.size()}`];
    if (this.readonly()) classes.push('rating--readonly');
    if (this.disabled() || this.isDisabled()) classes.push('rating--disabled');
    return classes.join(' ');
  });

  protected getStarState(star: number): 'full' | 'half' | 'empty' {
    const active = this.hoveredValue() || this.value();
    if (star <= Math.floor(active)) return 'full';
    if (this.allowHalf() && star - 0.5 <= active) return 'half';
    return 'empty';
  }

  protected getStarIcon(star: number): string {
    const state = this.getStarState(star);
    if (state === 'full') return 'star-solid';
    return 'star';
  }

  protected isStarFilled(star: number): boolean {
    return this.getStarState(star) === 'full';
  }

  protected isStarHalf(star: number): boolean {
    return this.getStarState(star) === 'half';
  }

  protected onStarClick(star: number): void {
    if (this.readonly() || this.disabled() || this.isDisabled()) return;
    this.value.set(star);
    this.ratingChange.emit(star);
    this.onChange(star);
  }

  protected onStarHover(star: number): void {
    if (this.readonly() || this.disabled() || this.isDisabled()) return;
    this.hoveredValue.set(star);
  }

  protected onMouseLeave(): void {
    this.hoveredValue.set(0);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (val: number) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

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

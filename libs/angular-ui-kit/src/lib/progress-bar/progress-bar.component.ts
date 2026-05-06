import {
  ChangeDetectionStrategy,
  Component,
  input,
  computed,
} from '@angular/core';

export type ProgressBarColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
export type ProgressBarSize = 'xs' | 'sm' | 'md' | 'lg';
export type ProgressBarVariant = 'linear' | 'circular';

/**
 * Progress bar component for displaying completion status.
 *
 * Supports linear and circular variants with configurable colors and sizes.
 *
 * @example
 * ```html
 * <lc-progress-bar [value]="75" color="primary" size="md"></lc-progress-bar>
 * <lc-progress-bar [value]="50" variant="circular" color="success"></lc-progress-bar>
 * ```
 */
@Component({
  selector: 'lc-progress-bar',
  standalone: true,
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressBarComponent {
  /**
   * Progress value between 0 and 100.
   * @default 0
   */
  value = input<number>(0);

  /**
   * Color theme.
   * @default 'primary'
   */
  color = input<ProgressBarColor>('primary');

  /**
   * Height/thickness of the bar.
   * @default 'md'
   */
  size = input<ProgressBarSize>('md');

  /**
   * Visual variant.
   * @default 'linear'
   */
  variant = input<ProgressBarVariant>('linear');

  /**
   * Whether to show the percentage label.
   * @default false
   */
  showLabel = input<boolean>(false);

  /**
   * Whether the progress is indeterminate (animated, no fixed value).
   * @default false
   */
  indeterminate = input<boolean>(false);

  /**
   * Accessible label for screen readers.
   */
  ariaLabel = input<string>('Progress');

  protected clampedValue = computed(() => Math.max(0, Math.min(100, this.value())));

  protected barClasses = computed(() => {
    return [
      'progress-bar',
      `progress-bar--${this.color()}`,
      `progress-bar--${this.size()}`,
      this.indeterminate() ? 'progress-bar--indeterminate' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  // Circular variant helpers
  protected readonly circleRadius = 40;
  protected readonly circleCircumference = 2 * Math.PI * 40;

  protected strokeDashoffset = computed(() => {
    return this.circleCircumference * (1 - this.clampedValue() / 100);
  });
}

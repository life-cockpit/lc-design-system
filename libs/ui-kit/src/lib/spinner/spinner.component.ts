import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

export type SpinnerSize = 'sm' | 'md' | 'lg';

/**
 * Spinner component for loading states.
 *
 * Displays a spinning indicator with an optional message.
 * Supports three sizes and respects the design-system color tokens.
 *
 * @example
 * ```html
 * <!-- Simple spinner -->
 * <lc-spinner />
 *
 * <!-- With message -->
 * <lc-spinner message="Loading data..." />
 *
 * <!-- Large spinner -->
 * <lc-spinner size="lg" message="Loading dashboard..." />
 * ```
 */
@Component({
  selector: 'lc-spinner',
  standalone: true,
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {
  /**
   * Size of the spinner
   * @default 'md'
   */
  readonly size = input<SpinnerSize>('md');

  /**
   * Optional loading message displayed below the spinner
   */
  readonly message = input<string>();

  protected readonly hostClasses = computed(() => `spinner spinner--${this.size()}`);
}

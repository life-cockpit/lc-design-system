import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

export type EmptyStateSize = 'sm' | 'md' | 'lg';

/**
 * Empty-state component for "no data" placeholders.
 *
 * Supports a compact inline mode (inside cards) and a larger page-level mode.
 * An optional icon, heading, description, and projected action slot are supported.
 *
 * @example
 * ```html
 * <!-- Inline / card-level (sm) -->
 * <lc-empty-state
 *   size="sm"
 *   message="No signals generated for this asset yet." />
 *
 * <!-- Page-level with icon + action -->
 * <lc-empty-state
 *   icon="chart-bar"
 *   heading="No Paper Trading Portfolios"
 *   message="Portfolios are created automatically when strategies are promoted."
 * >
 *   <lc-button variant="primary">Get Started</lc-button>
 * </lc-empty-state>
 * ```
 */
@Component({
  selector: 'lc-empty-state',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateComponent {
  /**
   * Size variant
   * - `sm`: compact inline (inside cards), no padding
   * - `md`: standard centered block (default)
   * - `lg`: large page-level with extra padding
   * @default 'md'
   */
  readonly size = input<EmptyStateSize>('md');

  /**
   * Heroicon name to display above the heading
   */
  readonly icon = input<string>();

  /**
   * Bold heading text
   */
  readonly heading = input<string>();

  /**
   * Description text
   */
  readonly message = input<string>();

  protected readonly hostClasses = computed(() => `empty-state empty-state--${this.size()}`);
}

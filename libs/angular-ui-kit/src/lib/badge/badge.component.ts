import { Component, ChangeDetectionStrategy, ViewEncapsulation, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';

/**
 * Badge component for displaying status, notifications, or counts.
 *
 * Features:
 * - Semantic color variants (primary, secondary, success, warning, error, info, neutral)
 * - Multiple size options (xs, sm, md, lg)
 * - Pill-shaped rounded mode
 * - Content projection for labels or count values
 *
 * @example
 * ```html
 * <lc-badge variant="primary" size="md">New</lc-badge>
 * <lc-badge variant="error" size="sm" [rounded]="true">5</lc-badge>
 * ```
 */
@Component({
  selector: 'lc-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None, // Required for dynamic variant class styling
})
export class BadgeComponent {
  /** Visual variant of the badge */
  variant = input<BadgeVariant>('default');

  /** Size of the badge */
  size = input<BadgeSize>('md');

  /** Whether the badge has fully rounded corners (pill shape) */
  rounded = input<boolean>(false);

  /**
   * Computed CSS classes for the badge
   */
  badgeClasses = computed(() => {
    const classes = ['lc-badge'];

    classes.push(`lc-badge--${this.variant()}`);
    classes.push(`lc-badge--${this.size()}`);

    if (this.rounded()) {
      classes.push('lc-badge--rounded');
    }

    return classes.join(' ');
  });
}

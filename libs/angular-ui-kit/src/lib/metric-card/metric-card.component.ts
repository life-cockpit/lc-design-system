import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { CardComponent } from '../card/card.component';

export type TrendDirection = 'up' | 'down' | 'flat';

/**
 * MetricCard Component
 *
 * Displays a single KPI value with label, trend arrow, and optional icon.
 * Built on top of `lc-card` (outlined variant) for consistent card styling.
 *
 * @example
 * ```html
 * <lc-metric-card
 *   label="Portfolio Equity"
 *   value="$125,430"
 *   trend="up"
 *   trendValue="+2.4%"
 *   icon="arrow-trending-up"
 * ></lc-metric-card>
 * ```
 */
@Component({
  selector: 'lc-metric-card',
  standalone: true,
  imports: [CommonModule, IconComponent, CardComponent],
  templateUrl: './metric-card.component.html',
  styleUrl: './metric-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricCardComponent {
  /** Label displayed above the value */
  label = input.required<string>();

  /** Formatted value to display */
  value = input.required<string>();

  /** Trend direction for arrow indicator */
  trend = input<TrendDirection>('flat');

  /** Formatted trend value (e.g., "+2.4%") */
  trendValue = input<string>('');

  /** Optional Heroicon name */
  icon = input<string>('');

  /** Trend arrow character */
  trendArrow = computed(() => {
    switch (this.trend()) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      default:
        return '→';
    }
  });

  /** Tailwind classes for trend color */
  trendClasses = computed(() => {
    switch (this.trend()) {
      case 'up':
        return 'text-green-600 dark:text-green-400';
      case 'down':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-500 dark:text-gray-400';
    }
  });
}

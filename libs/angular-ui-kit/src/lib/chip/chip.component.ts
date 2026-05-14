import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

export type ChipVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
export type ChipSize = 'sm' | 'md' | 'lg';

/**
 * Chip component for displaying tags, filters, or selections.
 *
 * Features:
 * - Color variants (primary, secondary, success, warning, error, info, neutral)
 * - Multiple size options (sm, md, lg)
 * - Optional leading icon
 * - Removable with close button and remove event
 * - Disabled state support
 *
 * @example
 * ```html
 * <lc-chip variant="primary" [removable]="true" (remove)="onRemove()">
 *   Tag Name
 * </lc-chip>
 * ```
 */
@Component({
  selector: 'lc-chip',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipComponent {
  /** Visual variant of the chip */
  variant = input<ChipVariant>('default');

  /** Size of the chip */
  size = input<ChipSize>('md');

  /** Icon name from Heroicons */
  icon = input<string>();

  /** Whether the chip can be removed */
  removable = input<boolean>(false);

  /** Whether the chip is disabled */
  disabled = input<boolean>(false);

  /** Emitted when the chip is removed */
  readonly remove = output<void>();

  /**
   * Computed CSS classes for the chip
   */
  chipClasses = computed(() => {
    const classes = ['lc-chip'];

    classes.push(`lc-chip--${this.variant()}`);
    classes.push(`lc-chip--${this.size()}`);

    if (this.removable()) {
      classes.push('lc-chip--removable');
    }

    if (this.disabled()) {
      classes.push('lc-chip--disabled');
    }

    return classes.join(' ');
  });

  /**
   * Handle remove button click
   */
  onRemove(event: Event): void {
    event.stopPropagation();

    if (!this.disabled()) {
      this.remove.emit();
    }
  }

  /**
   * Handle keyboard navigation
   */
  onKeydown(event: KeyboardEvent): void {
    if (!this.removable() || this.disabled()) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.remove.emit();
    }
  }
}

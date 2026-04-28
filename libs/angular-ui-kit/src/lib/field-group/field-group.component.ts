import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

/**
 * Field Group component for displaying label-value pairs in a consistent format.
 * Useful for read-only data displays like profile pages, detail views, etc.
 *
 * @example Basic usage
 * ```html
 * <lc-field-group label="Email" value="user@example.com"></lc-field-group>
 * ```
 *
 * @example With icon
 * ```html
 * <lc-field-group
 *   label="Language"
 *   value="English (US)"
 *   icon="globe-alt">
 * </lc-field-group>
 * ```
 *
 * @example With custom content via projection
 * ```html
 * <lc-field-group label="Status" icon="check-circle">
 *   <span class="status-badge">Active</span>
 * </lc-field-group>
 * ```
 */
@Component({
  selector: 'lc-field-group',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './field-group.component.html',
  styleUrls: ['./field-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'lc-field-group',
    '[class.lc-field-group--with-icon]': 'icon()',
    '[class.lc-field-group--compact]': 'compact()',
  },
})
export class FieldGroupComponent {
  /**
   * Label text displayed above the value
   */
  label = input.required<string>();

  /**
   * Value text to display (optional if using content projection)
   */
  value = input<string>();

  /**
   * Optional icon name from Heroicons
   */
  icon = input<string>();

  /**
   * Icon size
   * @default 'sm'
   */
  iconSize = input<'xs' | 'sm' | 'md'>('sm');

  /**
   * Use compact styling with less padding
   * @default false
   */
  compact = input<boolean>(false);
}

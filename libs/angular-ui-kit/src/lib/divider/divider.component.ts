import {
  ChangeDetectionStrategy,
  Component,
  input,
  computed,
} from '@angular/core';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerVariant = 'solid' | 'dashed' | 'dotted';
export type DividerSpacing = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Divider component for visual separation of content.
 *
 * Features:
 * - Horizontal and vertical orientations
 * - Line style variants (solid, dashed, dotted)
 * - Configurable spacing (none, sm, md, lg)
 * - Optional centered text label
 * - Dark mode support
 *
 * @example
 * ```html
 * <lc-divider></lc-divider>
 * <lc-divider orientation="vertical" variant="dashed"></lc-divider>
 * <lc-divider spacing="lg">OR</lc-divider>
 * ```
 */
@Component({
  selector: 'lc-divider',
  standalone: true,
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DividerComponent {
  /**
   * Orientation of the divider line.
   * @default 'horizontal'
   */
  orientation = input<DividerOrientation>('horizontal');

  /**
   * Line style.
   * @default 'solid'
   */
  variant = input<DividerVariant>('solid');

  /**
   * Spacing (margin) around the divider.
   * @default 'md'
   */
  spacing = input<DividerSpacing>('md');

  /**
   * Optional inline text label (e.g. "OR", "Section").
   */
  label = input<string | undefined>(undefined);

  protected dividerClasses = computed(() => {
    return [
      'divider',
      `divider--${this.orientation()}`,
      `divider--${this.variant()}`,
      `divider--spacing-${this.spacing()}`,
      this.label() ? 'divider--with-label' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });
}

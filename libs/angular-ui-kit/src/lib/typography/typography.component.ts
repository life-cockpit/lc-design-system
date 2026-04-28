import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

/**
 * Typography Component
 *
 * A flexible text component that provides consistent typography styling across the application.
 * Supports semantic HTML elements (h1-h6, p, span), text alignment, color variants,
 * font weights, text transforms, and line clamping.
 *
 * @example
 * ```html
 * <lc-typography variant="h1" align="center" color="primary">
 *   Main Heading
 * </lc-typography>
 *
 * <lc-typography variant="body1" gutterBottom>
 *   Body text with bottom margin
 * </lc-typography>
 *
 * <lc-typography variant="caption" color="secondary" lineClamp="2">
 *   This is a caption that will be truncated after 2 lines...
 * </lc-typography>
 * ```
 */
@Component({
  selector: 'lc-typography',
  templateUrl: './typography.component.html',
  styleUrl: './typography.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // eslint-disable-next-line @angular-eslint/use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None, // Required for global typography utilities
})
export class TypographyComponent {
  /**
   * Typography variant determining the HTML element and default styles
   * - h1-h6: Heading elements with corresponding sizes
   * - body1: Default paragraph text (16px)
   * - body2: Smaller body text (14px)
   * - subtitle1: Larger subtitle (18px)
   * - subtitle2: Smaller subtitle (14px)
   * - caption: Small helper text (12px)
   * - overline: Uppercase accent text (10px)
   * @default 'body1'
   */
  variant = input<
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'body1'
    | 'body2'
    | 'subtitle1'
    | 'subtitle2'
    | 'caption'
    | 'overline'
  >('body1');

  /**
   * Text alignment
   * @default 'left'
   */
  align = input<'left' | 'center' | 'right' | 'justify'>('left');

  /**
   * Text color using semantic color tokens
   * @default 'primary'
   */
  color = input<'primary' | 'secondary' | 'disabled' | 'error' | 'success' | 'warning' | 'info'>(
    'primary',
  );

  /**
   * Font weight
   * @default 'regular'
   */
  weight = input<'regular' | 'medium' | 'semibold' | 'bold'>('regular');

  /**
   * Text transform
   * @default 'none'
   */
  transform = input<'none' | 'uppercase' | 'lowercase' | 'capitalize'>('none');

  /**
   * Prevent text wrapping (applies ellipsis on overflow)
   * @default false
   */
  noWrap = input<boolean>(false);

  /**
   * Limit text to a specific number of lines (1-6)
   * Uses CSS line-clamp for multi-line truncation
   * @default undefined
   */
  lineClamp = input<number | undefined>(undefined);

  /**
   * Add bottom margin (1rem) for spacing between elements
   * @default false
   */
  gutterBottom = input<boolean>(false);

  /**
   * Compute the HTML element tag based on variant
   */
  readonly elementTag = computed<string>(() => {
    const variantValue = this.variant();
    if (variantValue.startsWith('h')) {
      return variantValue; // h1, h2, h3, h4, h5, h6
    }
    if (variantValue === 'caption' || variantValue === 'overline') {
      return 'span';
    }
    return 'p'; // body1, body2, subtitle1, subtitle2
  });

  /**
   * Compute all CSS classes based on inputs
   */
  readonly typographyClasses = computed<string>(() => {
    const classes: string[] = ['typography'];

    // Variant class
    classes.push(`typography-${this.variant()}`);

    // Alignment
    const alignValue = this.align();
    if (alignValue === 'left') classes.push('text-left');
    if (alignValue === 'center') classes.push('text-center');
    if (alignValue === 'right') classes.push('text-right');
    if (alignValue === 'justify') classes.push('text-justify');

    // Color
    const colorValue = this.color();
    if (colorValue === 'primary') classes.push('text-primary');
    if (colorValue === 'secondary') classes.push('text-secondary');
    if (colorValue === 'disabled') classes.push('text-disabled');
    if (colorValue === 'error') classes.push('text-error');
    if (colorValue === 'success') classes.push('text-success');
    if (colorValue === 'warning') classes.push('text-warning');
    if (colorValue === 'info') classes.push('text-info');

    // Weight
    const weightValue = this.weight();
    if (weightValue === 'regular') classes.push('font-regular');
    if (weightValue === 'medium') classes.push('font-medium');
    if (weightValue === 'semibold') classes.push('font-semibold');
    if (weightValue === 'bold') classes.push('font-bold');

    // Transform
    const transformValue = this.transform();
    if (transformValue === 'uppercase') classes.push('uppercase');
    if (transformValue === 'lowercase') classes.push('lowercase');
    if (transformValue === 'capitalize') classes.push('capitalize');

    // No wrap
    if (this.noWrap()) {
      classes.push('whitespace-nowrap', 'overflow-hidden', 'text-ellipsis');
    }

    // Line clamp
    const lineClampValue = this.lineClamp();
    if (lineClampValue !== undefined && lineClampValue >= 1 && lineClampValue <= 6) {
      classes.push(`line-clamp-${lineClampValue}`);
    }

    // Gutter bottom
    if (this.gutterBottom()) {
      classes.push('mb-4');
    }

    return classes.join(' ');
  });
}

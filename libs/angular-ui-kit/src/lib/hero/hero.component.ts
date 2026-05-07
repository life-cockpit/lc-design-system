import {
  ChangeDetectionStrategy,
  Component,
  input,
  computed,
} from '@angular/core';

export type HeroColor =
  | 'primary'
  | 'secondary'
  | 'neutral'
  | 'success'
  | 'info'
  | 'warning'
  | 'accent-orange'
  | 'accent-purple'
  | 'accent-violet';

export type HeroSize = 'sm' | 'md' | 'lg';
export type HeroVariant = 'default' | 'slim' | 'light';

/**
 * Hero component for prominent page headers with gradient backgrounds.
 *
 * Features:
 * - Color gradient variants (primary, secondary, success, warning, info, neutral, accent-orange, accent-purple, accent-violet)
 * - 3 visual variants: default (dark gradient), slim (compact banner), light (pastel gradient with dark text)
 * - Size options (sm, md, lg)
 * - Optional label text above the title
 * - Configurable border radius
 * - Content projection for body and footer sections
 * - Footer slot for metadata, stats, or CTAs
 *
 * @example
 * ```html
 * <lc-hero label="MY APP" title="Welcome" color="primary" variant="slim">
 *   <p>Description text</p>
 *   <div hero-footer>Status: Active</div>
 * </lc-hero>
 * ```
 */
@Component({
  selector: 'lc-hero',
  standalone: true,
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent {
  /**
   * Small uppercase label displayed above the title.
   */
  label = input<string | undefined>(undefined);

  /**
   * Main headline text.
   */
  title = input.required<string>();

  /**
   * Color theme for the gradient background.
   * @default 'primary'
   */
  color = input<HeroColor>('primary');

  /**
   * Size variant controlling padding and font sizes.
   * @default 'md'
   */
  size = input<HeroSize>('md');

  /**
   * Border radius of the hero container.
   * @default 'lg'
   */
  borderRadius = input<'none' | 'sm' | 'md' | 'lg'>('lg');

  /**
   * Visual variant.
   * - `default`: dark gradient with white text
   * - `slim`: compact single-line banner
   * - `light`: softer pastel gradient with dark text
   * @default 'default'
   */
  variant = input<HeroVariant>('default');

  protected heroClasses = computed(() => {
    return [
      'hero',
      `hero--${this.color()}`,
      `hero--${this.size()}`,
      `hero--radius-${this.borderRadius()}`,
      `hero--${this.variant()}`,
    ].join(' ');
  });
}

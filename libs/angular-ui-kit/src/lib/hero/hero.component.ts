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

/**
 * Hero component for prominent page headers with gradient backgrounds.
 *
 * Use it to display key information at the top of a page, such as a title,
 * description, and optional metadata items.
 *
 * Supports content projection for full flexibility:
 * - Default slot: description/body content
 * - `[hero-footer]`: bottom section for metadata, stats, or CTAs
 *
 * @example
 * ```html
 * <lc-hero label="MY APP" title="Welcome to the platform" color="primary">
 *   <p>A short description of what this page is about.</p>
 *   <div hero-footer>
 *     <span>Status: Active</span>
 *   </div>
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

  protected heroClasses = computed(() => {
    return [
      'hero',
      `hero--${this.color()}`,
      `hero--${this.size()}`,
      `hero--radius-${this.borderRadius()}`,
    ].join(' ');
  });
}

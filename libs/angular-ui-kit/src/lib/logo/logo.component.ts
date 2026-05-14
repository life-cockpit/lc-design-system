import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';

/**
 * Logo component for displaying the Life-Cockpit brand identity.
 *
 * Features:
 * - Full logo and emblem-only variants
 * - Multiple size options (sm, md, lg)
 * - SVG-based for crisp rendering at any resolution
 * - Dark mode compatible
 *
 * @example
 * ```html
 * <lc-logo variant="full" size="md"></lc-logo>
 * <lc-logo variant="emblem" size="sm"></lc-logo>
 * ```
 */
@Component({
  selector: 'lc-logo',
  standalone: true,
  imports: [],
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoComponent {
  /**
   * Logo variant to display
   * - 'full': Full logo with text
   * - 'emblem': Just the emblem/icon
   */
  readonly variant = input<'full' | 'emblem'>('full');

  /**
   * Size of the logo
   * - 'xs': 24px height
   * - 'sm': 32px height
   * - 'md': 48px height (default)
   * - 'lg': 64px height
   * - 'xl': 96px height
   */
  readonly size = input<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');

  /**
   * Alt text for accessibility
   */
  readonly alt = input('Life-Cockpit');

  /**
   * Makes the logo appear clickable
   */
  readonly clickable = input(false);

  /**
   * Color mode for different backgrounds
   * - 'auto': Follows global theme (uses CSS filter in dark mode)
   * - 'light': Optimized for light backgrounds (default appearance)
   * - 'dark': Inverted for dark backgrounds (white/light logo)
   */
  readonly colorMode = input<'auto' | 'light' | 'dark'>('auto');

  readonly logoSrc = computed(() => {
    return this.variant() === 'emblem'
      ? '/assets/life-cockpit-emblem.svg'
      : '/assets/life-cockpit-logo.svg';
  });

  readonly logoClasses = computed(() => {
    const classes = [`size-${this.size()}`];
    if (this.clickable()) {
      classes.push('clickable');
    }
    if (this.colorMode() === 'dark') {
      classes.push('lc-logo--dark');
    } else if (this.colorMode() === 'auto') {
      classes.push('lc-logo--auto');
    }
    return classes.join(' ');
  });
}

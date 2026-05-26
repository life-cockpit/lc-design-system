import {
  Component,
  InjectionToken,
  input,
  inject,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';

/**
 * Injection token for the base path used to resolve the built-in
 * Life-Cockpit logo assets. Defaults to `'/assets'` so consuming apps
 * that copy the package's `assets/` folder to their public root keep
 * working out of the box.
 *
 * Override this token at the application root if your app serves
 * static files from a different prefix (e.g. `/static`, `/ui-kit`).
 *
 * @example
 * ```ts
 * providers: [
 *   { provide: LC_LOGO_BASE_PATH, useValue: '/static/lc' },
 * ]
 * ```
 */
export const LC_LOGO_BASE_PATH = new InjectionToken<string>('LC_LOGO_BASE_PATH', {
  providedIn: 'root',
  factory: () => '/assets',
});

/**
 * Logo component for displaying a brand identity.
 *
 * Defaults to the Life-Cockpit logo but accepts custom `src` / `emblemSrc`
 * (and optional `darkSrc` / `darkEmblemSrc`) so consuming apps can drop in
 * their own brand assets without forking the component.
 *
 * Features:
 * - Full logo and emblem-only variants
 * - Multiple size options (xs, sm, md, lg, xl)
 * - Optional theme-aware dark-variant sources via `<picture>`
 * - Falls back to a CSS `invert` filter only for the built-in Life-Cockpit
 *   assets (custom logos are never auto-inverted to avoid color distortion)
 *
 * @example Default Life-Cockpit logo
 * ```html
 * <lc-logo variant="full" size="md"></lc-logo>
 * ```
 *
 * @example Custom brand logo
 * ```html
 * <lc-logo
 *   src="/assets/acme-logo.svg"
 *   emblemSrc="/assets/acme-emblem.svg"
 *   darkSrc="/assets/acme-logo-dark.svg"
 *   alt="Acme Inc.">
 * </lc-logo>
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
   * Color mode for different backgrounds (only affects the built-in
   * Life-Cockpit assets via CSS `invert`; custom logos are never inverted).
   * - 'auto': Follows global theme
   * - 'light': Optimized for light backgrounds
   * - 'dark': Inverted for dark backgrounds
   */
  readonly colorMode = input<'auto' | 'light' | 'dark'>('auto');

  /**
   * Custom URL for the full logo. When set, overrides the built-in
   * Life-Cockpit asset (and disables the auto-invert filter).
   */
  readonly src = input<string>('');

  /**
   * Custom URL for the emblem-only logo. When set, overrides the built-in
   * Life-Cockpit emblem (and disables the auto-invert filter).
   */
  readonly emblemSrc = input<string>('');

  /**
   * Optional dark-theme URL for the full logo. When provided, the logo
   * automatically swaps in dark mode (via `prefers-color-scheme: dark`).
   */
  readonly darkSrc = input<string>('');

  /**
   * Optional dark-theme URL for the emblem-only logo.
   */
  readonly darkEmblemSrc = input<string>('');

  /** Whether the consumer supplied at least one custom source. */
  readonly hasCustomSrc = computed(
    () => !!this.src() || !!this.emblemSrc() || !!this.darkSrc() || !!this.darkEmblemSrc(),
  );

  private readonly basePath = inject(LC_LOGO_BASE_PATH);

  readonly logoSrc = computed(() => {
    const isEmblem = this.variant() === 'emblem';
    const base = this.basePath.replace(/\/$/, '');
    if (isEmblem) {
      return this.emblemSrc() || `${base}/life-cockpit-emblem.svg`;
    }
    return this.src() || `${base}/life-cockpit-logo.svg`;
  });

  /** Dark-theme source for the current variant, or empty string if none. */
  readonly logoDarkSrc = computed(() => {
    return this.variant() === 'emblem' ? this.darkEmblemSrc() : this.darkSrc();
  });

  readonly logoClasses = computed(() => {
    const classes = [`size-${this.size()}`];
    if (this.clickable()) {
      classes.push('clickable');
    }
    // Auto-invert filter only applies to the built-in Life-Cockpit assets
    // to avoid distorting customer brand colors.
    if (!this.hasCustomSrc()) {
      if (this.colorMode() === 'dark') {
        classes.push('lc-logo--dark');
      } else if (this.colorMode() === 'auto') {
        classes.push('lc-logo--auto');
      }
    }
    return classes.join(' ');
  });
}

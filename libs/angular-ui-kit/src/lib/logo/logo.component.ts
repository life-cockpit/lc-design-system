import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Logo Component
 *
 * Displays the Life-Cockpit logo or emblem.
 *
 * Usage:
 * ```html
 * <lc-logo variant="full" size="md"></lc-logo>
 * <lc-logo variant="emblem" size="sm"></lc-logo>
 * ```
 */
@Component({
  selector: 'lc-logo',
  standalone: true,
  imports: [CommonModule],
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
  @Input() variant: 'full' | 'emblem' = 'full';

  /**
   * Size of the logo
   * - 'xs': 24px height
   * - 'sm': 32px height
   * - 'md': 48px height (default)
   * - 'lg': 64px height
   * - 'xl': 96px height
   */
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';

  /**
   * Alt text for accessibility
   */
  @Input() alt = 'Life-Cockpit';

  /**
   * Makes the logo appear clickable
   */
  @Input() clickable = false;

  get logoSrc(): string {
    return this.variant === 'emblem'
      ? '/assets/life-cockpit-emblem.svg'
      : '/assets/life-cockpit-logo.svg';
  }

  get logoClasses(): string {
    const classes = [`size-${this.size}`];
    if (this.clickable) {
      classes.push('clickable');
    }
    return classes.join(' ');
  }
}

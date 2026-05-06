import {
  ChangeDetectionStrategy,
  Component,
  input,
  computed,
} from '@angular/core';
import { IconComponent } from '../icon/icon.component';

export interface FooterLink {
  /** Display label */
  label: string;
  /** URL or route */
  href: string;
  /** Whether it opens in a new tab */
  external?: boolean;
}

export interface FooterSection {
  /** Section heading */
  title: string;
  /** Links in this section */
  links: FooterLink[];
}

export type FooterVariant = 'default' | 'primary' | 'dark' | 'neutral';

@Component({
  selector: 'lc-footer',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * Footer component for application-wide bottom navigation.
 *
 * Features:
 * - Multi-section navigation with link groups
 * - Copyright text display
 * - Compact single-row layout option
 * - Color variants (light, dark)
 * - Optional top border
 * - Social media icon links
 *
 * @example
 * ```html
 * <lc-footer [sections]="navSections" copyright="© 2026 Company" />
 * ```
 */
export class FooterComponent {
  /** Footer navigation sections */
  sections = input<FooterSection[]>([]);

  /** Copyright text */
  copyright = input<string>();

  /** Whether to show a top border */
  showBorder = input<boolean>(true);

  /** Compact layout (single row) */
  compact = input<boolean>(false);

  /** Color variant */
  variant = input<FooterVariant>('default');

  protected footerClasses = computed(() => {
    const classes = ['footer', `footer--${this.variant()}`];
    if (this.showBorder()) classes.push('footer--bordered');
    if (this.compact()) classes.push('footer--compact');
    return classes.join(' ');
  });

  protected currentYear = new Date().getFullYear();
}

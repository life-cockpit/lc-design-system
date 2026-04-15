import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  inject,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../button/button.component';
import { LogoComponent } from '../logo/logo.component';
import { IconComponent } from '../icon/icon.component';
import { AvatarComponent } from '../avatar/avatar.component';
import { MenuComponent, MenuItem } from '../menu/menu.component';
import { ThemeService } from '../theme/theme.service';

/**
 * AppHeaderComponent - Global application header for Life-Cockpit shell
 *
 * Features:
 * - Clickable logo for home navigation
 * - Optional title and subtitle display
 * - User profile dropdown with avatar, name, email, optional Profile link, and Logout
 * - Optional theme toggle button in header
 * - Hamburger menu toggle for mobile sidebar
 * - OnPush change detection for performance
 *
 * @example
 * ```html
 * <lc-header
 *   [logo]="'/assets/logo.svg'"
 *   [title]="'Life-Cockpit'"
 *   [subtitle]="'User Profile'"
 *   [userName]="'John Doe'"
 *   [userEmail]="'user@example.com'"
 *   [showHamburger]="true"
 *   [showThemeButton]="true"
 *   [showProfileMenuItem]="true"
 *   (hamburgerClick)="toggleSidebar()"
 *   (themeToggleClick)="toggleTheme()"
 *   (profileClick)="navigateToProfile()"
 *   (logoutClick)="handleLogout()"
 * />
 * ```
 */
@Component({
  selector: 'lc-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonComponent,
    LogoComponent,
    IconComponent,
    AvatarComponent,
    MenuComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  // eslint-disable-next-line @angular-eslint/use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'lc-header-host',
  },
})
export class HeaderComponent {
  /**
   * Logo image source URL
   */
  @Input() logo: string = '';

  /**
   * Optional title to display next to logo
   */
  @Input() title: string = '';

  /**
   * Optional subtitle to display under title
   */
  @Input() subtitle: string = '';

  /**
   * User email to display in profile dropdown
   */
  @Input() userEmail: string = '';

  /**
   * User full name for avatar initials
   * @example 'John Doe'
   */
  @Input() userName: string = '';

  /**
   * Whether to show hamburger menu icon (for mobile sidebar toggle)
   */
  @Input() showHamburger: boolean = false;

  /**
   * Whether to show theme toggle button in header
   */
  @Input() showThemeButton: boolean = false;

  /**
   * Whether to show the Profile menu item in the user dropdown
   * @default true
   */
  @Input() showProfileMenuItem: boolean = true;

  /**
   * Emitted when hamburger menu icon is clicked
   */
  @Output() readonly hamburgerClick = new EventEmitter<void>();

  /**
   * Emitted when theme toggle is clicked
   */
  @Output() readonly themeToggleClick = new EventEmitter<void>();

  /**
   * Emitted when Logout is clicked in profile dropdown
   */
  @Output() readonly logoutClick = new EventEmitter<void>();

  /**
   * Emitted when Profile menu item is clicked
   */
  @Output() readonly profileClick = new EventEmitter<void>();

  protected readonly themeService = inject(ThemeService);

  /**
   * Get menu items for profile dropdown
   */
  protected readonly menuItems = computed<MenuItem[]>(() => {
    const items: MenuItem[] = [];

    // Add profile link if enabled
    if (this.showProfileMenuItem) {
      items.push({
        id: 'profile',
        label: 'Profile',
        icon: 'user',
        dividerAfter: true,
      });
    }

    // Add logout
    items.push({
      id: 'logout',
      label: 'Logout',
      icon: 'arrow-right-start-on-rectangle',
      variant: 'danger',
    });

    return items;
  });

  /**
   * Dropdown open state (using Angular signals)
   */
  private readonly dropdownOpen = signal<boolean>(false);

  /**
   * Get dropdown open state
   */
  isDropdownOpen(): boolean {
    return this.dropdownOpen();
  }

  /**
   * Toggle profile dropdown visibility
   */
  toggleDropdown(): void {
    this.dropdownOpen.set(!this.dropdownOpen());
  }

  /**
   * Close profile dropdown
   */
  closeDropdown(): void {
    this.dropdownOpen.set(false);
  }

  /**
   * Handle hamburger click
   */
  onHamburgerClick(): void {
    this.hamburgerClick.emit();
  }

  /**
   * Handle theme button click (separate button, not in menu)
   */
  onThemeButtonClick(): void {
    this.themeService.toggleTheme();
    this.themeToggleClick.emit();
  }

  /**
   * Handle logout click
   */
  onLogoutClick(): void {
    this.logoutClick.emit();
    this.closeDropdown();
  }

  /**
   * Handle profile click
   */
  onProfileClick(): void {
    this.profileClick.emit();
    this.closeDropdown();
  }

  /**
   * Handle menu item click
   */
  onMenuItemClick(item: MenuItem): void {
    if (item.id === 'logout') {
      this.onLogoutClick();
    } else if (item.id === 'profile') {
      this.onProfileClick();
    }
  }
}

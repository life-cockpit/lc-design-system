import {
  Component,
  input,
  output,
  signal,
  computed,
  inject,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
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
  readonly theme = input<'light' | 'dark' | 'auto'>('auto');
  readonly logo = input('');
  readonly showLogo = input(true);
  readonly title = input('');
  readonly subtitle = input('');
  readonly userEmail = input('');
  readonly userName = input('');
  readonly showHamburger = input(false);
  readonly showThemeButton = input(false);
  readonly contextName = input('');
  readonly contextLabel = input('');
  readonly menuSize = input<'sm' | 'md' | 'lg'>('sm');
  readonly showProfileMenuItem = input(true);

  readonly hamburgerClick = output<void>();
  readonly themeToggleClick = output<void>();
  readonly logoutClick = output<void>();
  readonly profileClick = output<void>();
  readonly contextClick = output<void>();

  protected readonly themeService = inject(ThemeService);

  /**
   * Get menu items for profile dropdown
   */
  protected readonly menuItems = computed<MenuItem[]>(() => {
    const items: MenuItem[] = [];

    // Add profile link if enabled
    if (this.showProfileMenuItem()) {
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

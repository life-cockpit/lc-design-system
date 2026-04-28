import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  HeaderComponent,
  CardComponent,
  ThemeService,
  TableComponent,
  TableColumn,
} from '@life-cockpit/angular-ui-kit';

/**
 * Header Component Demo Page
 *
 * Showcases AppHeaderComponent variations and usage examples
 */
@Component({
  selector: 'app-header-demo',
  standalone: true,
  imports: [CommonModule, HeaderComponent, CardComponent, TableComponent],
  templateUrl: './header-demo.component.html',
  styleUrl: './header-demo.component.scss',
})
export class HeaderDemoComponent {
  private themeService = inject(ThemeService);
  /**
   * Example logo path
   */
  logoPath = '/assets/life-cockpit-logo.svg';

  /**
   * Example user name
   */
  userName = 'John Doe';

  /**
   * Example user email
   */
  userEmail = 'demo@life-cockpit.de';

  /**
   * Show hamburger state
   */
  showHamburger = false;

  /**
   * Mobile view state
   */
  isMobileView = false;

  /**
   * Handle hamburger click
   */
  onHamburgerClick(): void {
    console.log('Hamburger clicked - sidebar should toggle');
    alert('Hamburger clicked! In real app, this would toggle the sidebar.');
  }

  /**
   * Handle logout click
   */
  onLogoutClick(): void {
    console.log('Logout clicked');
    alert('Logout clicked! In real app, this would sign out the user.');
  }

  /**
   * Handle profile click
   */
  navigateToProfile(): void {
    console.log('Profile clicked');
    alert('Profile clicked! In real app, this would navigate to the profile page.');
  }

  /**
   * Handle theme toggle click
   */
  onThemeToggleClick(): void {
    console.log('Theme toggle clicked');
    this.themeService.toggleTheme();
  }

  /**
   * Toggle mobile view
   */
  toggleMobileView(): void {
    this.isMobileView = !this.isMobileView;
    this.showHamburger = this.isMobileView;
  }

  // API Documentation Tables
  protected inputsColumns = signal<TableColumn[]>([
    { key: 'name', label: 'Name', sortable: false },
    { key: 'type', label: 'Type', sortable: false },
    { key: 'default', label: 'Default', sortable: false },
    { key: 'description', label: 'Description', sortable: false },
  ]);

  protected inputsData = signal([
    { name: 'logo', type: 'string', default: "''", description: 'Logo image source URL' },
    {
      name: 'title',
      type: 'string',
      default: "''",
      description: 'Optional title to display next to logo',
    },
    {
      name: 'subtitle',
      type: 'string',
      default: "''",
      description: 'Optional subtitle to display under title',
    },
    {
      name: 'userEmail',
      type: 'string',
      default: "''",
      description: 'User email to display in profile dropdown',
    },
    {
      name: 'userName',
      type: 'string',
      default: "''",
      description: 'User full name for avatar initials',
    },
    {
      name: 'showHamburger',
      type: 'boolean',
      default: 'false',
      description: 'Whether to show hamburger menu icon',
    },
    {
      name: 'showThemeButton',
      type: 'boolean',
      default: 'false',
      description: 'Whether to show theme toggle button in header',
    },
    {
      name: 'showProfileMenuItem',
      type: 'boolean',
      default: 'true',
      description: 'Whether to show Profile menu item in user dropdown',
    },
  ]);

  protected outputsColumns = signal<TableColumn[]>([
    { key: 'name', label: 'Name', sortable: false },
    { key: 'type', label: 'Type', sortable: false },
    { key: 'description', label: 'Description', sortable: false },
  ]);

  protected outputsData = signal([
    {
      name: 'hamburgerClick',
      type: 'EventEmitter<void>',
      description: 'Emitted when hamburger menu icon is clicked',
    },
    {
      name: 'themeToggleClick',
      type: 'EventEmitter<void>',
      description: 'Emitted when theme toggle is clicked',
    },
    {
      name: 'profileClick',
      type: 'EventEmitter<void>',
      description: 'Emitted when Profile menu item is clicked',
    },
    {
      name: 'logoutClick',
      type: 'EventEmitter<void>',
      description: 'Emitted when Logout is clicked in profile dropdown',
    },
  ]);
}

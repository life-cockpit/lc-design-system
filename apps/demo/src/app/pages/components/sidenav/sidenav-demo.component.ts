import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  SidenavComponent,
  NavigationItem,
  ButtonComponent,
  SelectComponent,
  CheckboxComponent,
  TableComponent,
  TableColumn,
} from '@life-cockpit/angular-ui-kit';

@Component({
  selector: 'app-sidenav-demo',
  imports: [
    SidenavComponent,
    ButtonComponent,
    SelectComponent,
    CheckboxComponent,
    FormsModule,
    TableComponent,
  ],
  templateUrl: './sidenav-demo.component.html',
  styleUrl: './sidenav-demo.component.scss',
})
export class SidenavDemoComponent {
  // Demo state
  basicLeftOpen = signal(false);
  basicRightOpen = signal(false);
  noOverlayOpen = signal(false);
  customWidthOpen = signal(false);
  withContentOpen = signal(false);
  withNavItemsOpen = signal(false); // NEW - for NavigationItem[] demo

  // Navigation items example (NEW)
  navItems: NavigationItem[] = [
    {
      id: 'home',
      icon: 'lc-icon-home',
      label: 'Home',
      route: '/',
      displayOrder: 1,
    },
    {
      id: 'trading',
      icon: 'lc-icon-chart',
      label: 'Trading',
      route: '/trading',
      requiredRole: 'LC.Trader',
      displayOrder: 2,
    },
    {
      id: 'profile',
      icon: 'lc-icon-user',
      label: 'Profile',
      route: '/profile',
      displayOrder: 3,
    },
  ];

  // Active route for highlighting (NEW)
  activeRoute = signal('/');

  // Settings form state
  theme = signal<string>('light');
  language = signal<string>('en');
  notifications = signal(false);

  // Select options
  themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'auto', label: 'Auto' },
  ];

  languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'de', label: 'Deutsch' },
    { value: 'fr', label: 'Français' },
  ];

  openBasicLeft(): void {
    this.basicLeftOpen.set(true);
  }

  closeBasicLeft(): void {
    this.basicLeftOpen.set(false);
  }

  openBasicRight(): void {
    this.basicRightOpen.set(true);
  }

  closeBasicRight(): void {
    this.basicRightOpen.set(false);
  }

  openNoOverlay(): void {
    this.noOverlayOpen.set(true);
  }

  closeNoOverlay(): void {
    this.noOverlayOpen.set(false);
  }

  openCustomWidth(): void {
    this.customWidthOpen.set(true);
  }

  closeCustomWidth(): void {
    this.customWidthOpen.set(false);
  }

  openWithContent(): void {
    this.withContentOpen.set(true);
  }

  closeWithContent(): void {
    this.withContentOpen.set(false);
  }

  // NEW - NavigationItem[] demo methods
  openWithNavItems(): void {
    this.withNavItemsOpen.set(true);
  }

  closeWithNavItems(): void {
    this.withNavItemsOpen.set(false);
  }

  handleNavItemClick(item: NavigationItem): void {
    console.log('Navigation item clicked:', item);
    this.activeRoute.set(item.route);
    alert(`Navigating to: ${item.label} (${item.route})`);
  }

  // API Documentation
  apiColumns = signal<TableColumn[]>([
    { key: 'prop', label: 'Property', sortable: false },
    { key: 'type', label: 'Type', sortable: false },
    { key: 'default', label: 'Default', sortable: false },
    { key: 'description', label: 'Description', sortable: false },
  ]);

  apiData = signal([
    {
      prop: 'isOpenInput',
      type: 'boolean',
      default: 'false',
      description: 'Controls whether the sidenav is open or closed',
    },
    {
      prop: 'modeInput',
      type: "'drawer' | 'docked'",
      default: "'drawer'",
      description: "Display mode: 'drawer' (overlay) or 'docked' (persistent sidebar)",
    },
    {
      prop: 'positionInput',
      type: "'left' | 'right'",
      default: "'left'",
      description: 'Position from which the sidenav slides in (drawer mode)',
    },
    {
      prop: 'widthInput',
      type: 'string',
      default: "'320px'",
      description: 'Width of the sidenav drawer/panel',
    },
    {
      prop: 'itemsInput',
      type: 'NavigationItem[]',
      default: '[]',
      description: 'Navigation items to display. Use isSection for section headlines.',
    },
    {
      prop: 'ariaLabelInput',
      type: 'string',
      default: "'Side navigation'",
      description: 'ARIA label for screen readers',
    },
    {
      prop: 'hasOverlayInput',
      type: 'boolean',
      default: 'true',
      description: 'Whether to show overlay backdrop (drawer mode)',
    },
    {
      prop: '(closed)',
      type: 'EventEmitter<void>',
      default: '-',
      description: 'Event emitted when sidenav should close',
    },
    {
      prop: '(itemClicked)',
      type: 'EventEmitter<NavigationItem>',
      default: '-',
      description: 'Event emitted when a navigation item is clicked',
    },
  ]);
}

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MenuComponent,
  MenuItem,
  ButtonComponent,
  CardComponent,
  IconComponent,
  TableComponent,
  TableColumn,
} from '@life-cockpit/angular-ui-kit';

@Component({
  selector: 'app-menu-demo',
  standalone: true,
  imports: [
    CommonModule,
    MenuComponent,
    ButtonComponent,
    CardComponent,
    IconComponent,
    TableComponent,
  ],
  templateUrl: './menu-demo.component.html',
  styleUrl: './menu-demo.component.scss',
})
export class MenuDemoComponent {
  basicMenuOpen = signal(false);
  iconMenuOpen = signal(false);
  profileMenuOpen = signal(false);
  positionMenuOpen = signal('');

  basicMenuItems: MenuItem[] = [
    { id: 'item1', label: 'Menu Item 1' },
    { id: 'item2', label: 'Menu Item 2' },
    { id: 'item3', label: 'Menu Item 3', dividerAfter: true },
    { id: 'item4', label: 'Delete', variant: 'danger' },
  ];

  iconMenuItems: MenuItem[] = [
    { id: 'new', label: 'New File', icon: 'document-plus' },
    { id: 'open', label: 'Open', icon: 'folder-open' },
    { id: 'save', label: 'Save', icon: 'arrow-down-tray', dividerAfter: true },
    { id: 'settings', label: 'Settings', icon: 'cog-6-tooth' },
  ];

  profileMenuItems: MenuItem[] = [
    {
      id: 'profile',
      label: 'John Doe',
      icon: 'user',
      metadata: { subtitle: 'john.doe@example.com' },
      dividerAfter: true,
    },
    { id: 'account', label: 'Account Settings', icon: 'cog-6-tooth' },
    { id: 'billing', label: 'Billing', icon: 'credit-card' },
    { id: 'help', label: 'Help & Support', icon: 'question-mark-circle', dividerAfter: true },
    { id: 'logout', label: 'Logout', icon: 'arrow-right-start-on-rectangle', variant: 'danger' },
  ];

  handleMenuItemClick(item: MenuItem): void {
    console.log('Menu item clicked:', item);
    this.basicMenuOpen.set(false);
    this.iconMenuOpen.set(false);
    this.profileMenuOpen.set(false);
    this.positionMenuOpen.set('');
  }

  // API Documentation Tables
  protected inputsColumns = signal<TableColumn[]>([
    { key: 'property', label: 'Property', sortable: false },
    { key: 'type', label: 'Type', sortable: false },
    { key: 'default', label: 'Default', sortable: false },
    { key: 'description', label: 'Description', sortable: false },
  ]);

  protected inputsData = signal([
    { property: 'items', type: 'MenuItem[]', default: '[]', description: 'Menu items to display' },
    { property: 'isOpen', type: 'boolean', default: 'false', description: 'Whether menu is open' },
    {
      property: 'position',
      type: 'string',
      default: "'bottom-right'",
      description: "Menu position: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'",
    },
    {
      property: 'minWidth',
      type: 'string',
      default: "'220px'",
      description: 'Minimum width of menu dropdown',
    },
  ]);

  protected outputsColumns = signal<TableColumn[]>([
    { key: 'event', label: 'Event', sortable: false },
    { key: 'type', label: 'Type', sortable: false },
    { key: 'description', label: 'Description', sortable: false },
  ]);

  protected outputsData = signal([
    { event: 'itemClick', type: 'MenuItem', description: 'Emitted when menu item is clicked' },
    {
      event: 'closed',
      type: 'void',
      description: 'Emitted when menu should close (click outside, Escape)',
    },
  ]);
}

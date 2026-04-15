import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ListComponent,
  type ListItem,
  type ListOrientation,
  CardComponent,
  ButtonComponent,
  TableComponent,
  TableColumn,
} from '@life-cockpit/ui-kit';

@Component({
  selector: 'app-list-demo',
  imports: [CommonModule, ListComponent, CardComponent, ButtonComponent, TableComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListDemoComponent {
  // Playground controls
  protected orientation = signal<ListOrientation>('vertical');
  protected showDividers = signal(true);
  protected withIcons = signal(false);
  protected withActions = signal(false);

  // Sample list items
  protected basicItems = signal<ListItem[]>([
    { id: '1', label: 'Dashboard' },
    { id: '2', label: 'Profile' },
    { id: '3', label: 'Settings' },
    { id: '4', label: 'Logout' },
  ]);

  protected iconItems = signal<ListItem[]>([
    { id: '1', label: 'Dashboard', icon: 'chart-bar' },
    { id: '2', label: 'Profile', icon: 'user' },
    { id: '3', label: 'Settings', icon: 'cog-6-tooth' },
    { id: '4', label: 'Messages', icon: 'envelope' },
    { id: '5', label: 'Notifications', icon: 'bell' },
  ]);

  protected actionItems = signal<ListItem[]>([
    { id: '1', label: 'Document.pdf', action: 'Delete' },
    { id: '2', label: 'Image.jpg', action: 'Delete' },
    { id: '3', label: 'Spreadsheet.xlsx', action: 'Delete' },
  ]);

  protected disabledItems = signal<ListItem[]>([
    { id: '1', label: 'Active Item' },
    { id: '2', label: 'Disabled Item', disabled: true },
    { id: '3', label: 'Another Active Item' },
  ]);

  // Playground items
  protected playgroundItems = signal<ListItem[]>([
    { id: '1', label: 'Item 1', icon: 'document-text', action: 'Edit' },
    { id: '2', label: 'Item 2', icon: 'folder', action: 'Edit' },
    { id: '3', label: 'Item 3', icon: 'photo', action: 'Edit' },
  ]);

  // Demo code examples
  protected basicExample = `<lc-list [items]="items" />`;

  protected verticalExample = `<lc-list 
  [items]="items"
  orientation="vertical"
/>`;

  protected horizontalExample = `<lc-list 
  [items]="items"
  orientation="horizontal"
/>`;

  protected dividersExample = `<lc-list 
  [items]="items"
  [showDividers]="true"
/>`;

  protected iconsExample = `<lc-list [items]="iconItems" />

// iconItems = [
//   { id: '1', label: 'Dashboard', icon: 'chart-bar' },
//   { id: '2', label: 'Profile', icon: 'user' },
//   { id: '3', label: 'Settings', icon: 'cog-6-tooth' },
// ]`;

  protected actionsExample = `<lc-list 
  [items]="actionItems"
  (actionClick)="handleAction($event)"
/>

// actionItems = [
//   { id: '1', label: 'File.pdf', action: 'Delete' },
//   { id: '2', label: 'Image.jpg', action: 'Delete' },
// ]`;

  protected clickableExample = `<lc-list 
  [items]="items"
  (itemClick)="handleClick($event)"
/>

handleClick(item: ListItem) {
  console.log('Clicked:', item.label);
}`;

  protected disabledExample = `<lc-list [items]="disabledItems" />

// disabledItems = [
//   { id: '1', label: 'Active Item' },
//   { id: '2', label: 'Disabled Item', disabled: true },
// ]`;

  // API documentation
  protected propsData = [
    {
      name: 'items',
      type: 'ListItem[]',
      default: '[]',
      description: 'Array of list items to display',
    },
    {
      name: 'orientation',
      type: "'vertical' | 'horizontal'",
      default: "'vertical'",
      description: 'Layout direction of the list',
    },
    {
      name: 'showDividers',
      type: 'boolean',
      default: 'false',
      description: 'Whether to show dividers between items',
    },
  ];

  protected eventsData = [
    {
      name: 'itemClick',
      type: 'ListItem',
      description: 'Emitted when a list item is clicked',
    },
    {
      name: 'actionClick',
      type: 'ListItem',
      description: 'Emitted when an action button is clicked',
    },
  ];

  protected listItemData = [
    {
      name: 'label',
      type: 'string',
      required: 'Yes',
      description: 'The text content of the list item',
    },
    {
      name: 'id',
      type: 'string',
      required: 'No',
      description: 'Unique identifier for the item',
    },
    {
      name: 'icon',
      type: 'string',
      required: 'No',
      description: 'Icon to display before the label',
    },
    {
      name: 'action',
      type: 'string',
      required: 'No',
      description: 'Action button text to display',
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: 'No',
      description: 'Whether the item is disabled',
    },
  ];

  protected propsColumns = signal<TableColumn[]>([
    { key: 'name', label: 'Property', sortable: false },
    { key: 'type', label: 'Type', sortable: false },
    { key: 'default', label: 'Default', sortable: false },
    { key: 'description', label: 'Description', sortable: false },
  ]);

  protected eventsColumns = signal<TableColumn[]>([
    { key: 'name', label: 'Event', sortable: false },
    { key: 'type', label: 'Payload', sortable: false },
    { key: 'description', label: 'Description', sortable: false },
  ]);

  protected listItemColumns = signal<TableColumn[]>([
    { key: 'name', label: 'Property', sortable: false },
    { key: 'type', label: 'Type', sortable: false },
    { key: 'required', label: 'Required', sortable: false },
    { key: 'description', label: 'Description', sortable: false },
  ]);

  // Interactive controls
  protected setOrientation(orientation: ListOrientation): void {
    this.orientation.set(orientation);
  }

  protected toggleDividers(): void {
    this.showDividers.update((v) => !v);
  }

  protected toggleIcons(): void {
    this.withIcons.update((v) => !v);
    this.updatePlaygroundItems();
  }

  protected toggleActions(): void {
    this.withActions.update((v) => !v);
    this.updatePlaygroundItems();
  }

  private updatePlaygroundItems(): void {
    const items: ListItem[] = [
      {
        id: '1',
        label: 'Item 1',
        ...(this.withIcons() && { icon: 'document-text' }),
        ...(this.withActions() && { action: 'Edit' }),
      },
      {
        id: '2',
        label: 'Item 2',
        ...(this.withIcons() && { icon: 'folder' }),
        ...(this.withActions() && { action: 'Edit' }),
      },
      {
        id: '3',
        label: 'Item 3',
        ...(this.withIcons() && { icon: 'photo' }),
        ...(this.withActions() && { action: 'Edit' }),
      },
    ];
    this.playgroundItems.set(items);
  }

  // Event handlers
  protected handleItemClick(item: ListItem): void {
    console.log('Item clicked:', item);
  }

  protected handleActionClick(item: ListItem): void {
    console.log('Action clicked:', item);
  }
}
